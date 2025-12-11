import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'

dotenv.config()

// Sử dụng default credentials từ Lambda execution role (không cần hardcode credentials)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1'
})

// Bucket name format: ${Environment}-${ProjectName}-assets-${AWS::AccountId}
// Ví dụ: dev-daivietblood-assets-123456789012
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ''

export class S3Service {
  /**
   * Upload file to S3
   * @param fileBuffer - Buffer của file
   * @param fileName - Tên file gốc
   * @param mimeType - MIME type của file (image/jpeg, image/png, etc.)
   * @param folder - Thư mục trong S3 (blogs, avatars, etc.)
   * @returns URL của file đã upload
   */
  public async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = 'blogs'
  ): Promise<string> {
    // Tạo unique file name
    const fileExtension = fileName.split('.').pop() || 'jpg'
    const uniqueFileName = `${folder}/${uuidv4()}.${fileExtension}`

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: mimeType
      // ACL không cần vì bucket policy đã cho phép public read
    })

    try {
      await s3Client.send(command)
      // Trả về URL của file
      const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-southeast-1'}.amazonaws.com/${uniqueFileName}`
      return fileUrl
    } catch (error) {
      console.error('Error uploading to S3:', error)
      throw new Error('Failed to upload file to S3')
    }
  }

  /**
   * Upload base64 image to S3
   * @param base64Data - Base64 string của ảnh (có thể có hoặc không có prefix data:image/...)
   * @param folder - Thư mục trong S3
   * @returns URL của file đã upload
   */
  public async uploadBase64Image(base64Data: string, folder: string = 'blogs'): Promise<string> {
    // Xử lý base64 string
    let mimeType = 'image/jpeg'
    let base64String = base64Data

    // Kiểm tra nếu có prefix data:image/...
    if (base64Data.includes('base64,')) {
      const matches = base64Data.match(/^data:(.+);base64,(.+)$/)
      if (matches) {
        mimeType = matches[1]
        base64String = matches[2]
      }
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64String, 'base64')

    // Xác định extension từ mimeType
    const extensionMap: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp'
    }
    const extension = extensionMap[mimeType] || 'jpg'
    const fileName = `image.${extension}`

    return this.uploadFile(buffer, fileName, mimeType, folder)
  }

  /**
   * Delete file from S3
   * @param fileUrl - URL của file cần xóa
   */
  public async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL
      const urlParts = fileUrl.split('.amazonaws.com/')
      if (urlParts.length < 2) {
        throw new Error('Invalid S3 URL')
      }
      const key = urlParts[1]

      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
      })

      await s3Client.send(command)
    } catch (error) {
      console.error('Error deleting from S3:', error)
      throw new Error('Failed to delete file from S3')
    }
  }
}

export const s3Service = new S3Service()

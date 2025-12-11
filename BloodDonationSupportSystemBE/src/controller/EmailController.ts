import { sendEmailService } from '~/services/email.services';
import { Request, Response } from 'express';

export const sendEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, subject, htmlContent } = req.body;

        // Kiểm tra các tham số bắt buộc
        if (!email || !subject || !htmlContent) {
            res.status(400).json({
                status: 'error',
                message: 'Email, subject, and htmlContent are required',
            });
            return;
        }

        // Gửi email
        const response = await sendEmailService(email, subject, htmlContent);
        res.status(200).json({
            status: 'success',
            message: 'Email sent successfully',
            response,
        });
    } catch (error) {
        console.error('Error in sendEmail:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};

export const sendRecoveryReminderEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { donorEmail, donorName } = req.params; 

   
        if (!donorEmail || !donorName) {
            res.status(400).json({
                status: 'error',
                message: 'Email and Donor name are required',
            });
            return;
        }


        const subject = '💉 Nhắc nhở phục hồi sau khi hiến máu - Đại Việt Blood';
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5;">
                <!-- Header -->
                <div style="background-color: #dc3545; color: white; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">NHẮC NHỞ PHỤC HỒI SAU HIẾN MÁU</h1>
                    <p style="margin: 10px 0 0 0; font-size: 14px;">Trung tâm Hiến máu Đại Việt Blood</p>
                </div>
                
                <!-- Main Content -->
                <div style="background-color: white; padding: 30px;">
                    <h2 style="color: #dc3545; margin: 0 0 20px 0;">Xin chào ${donorName},</h2>
                    
                    <!-- Thank You Message -->
                    <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                        <h3 style="color: #155724; margin: 0;">🎉 Cảm ơn bạn đã hiến máu!</h3>
                        <p style="color: #155724; margin: 10px 0 0 0;">Hành động cao đẹp của bạn đã góp phần cứu sống nhiều người.</p>
                    </div>
                    
                    <!-- Recovery Tips -->
                    <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #856404; margin: 0 0 15px 0;">📋 Hướng dẫn phục hồi sau hiến máu:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #856404; line-height: 2;">
                            <li><strong>Nghỉ ngơi đầy đủ:</strong> Tránh các hoạt động gắng sức trong 24h</li>
                            <li><strong>Uống nhiều nước:</strong> Bổ sung 2-3 lít nước/ngày để giữ cơ thể đủ nước</li>
                            <li><strong>Ăn uống đầy đủ:</strong> Bổ sung thực phẩm giàu sắt như thịt đỏ, rau xanh</li>
                            <li><strong>Không hút thuốc:</strong> Tránh hút thuốc trong vòng 2 giờ</li>
                            <li><strong>Không uống rượu bia:</strong> Tránh trong 24 giờ sau hiến máu</li>
                        </ul>
                    </div>
                    
                    <!-- Warning Signs -->
                    <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #721c24; margin: 0 0 15px 0;">⚠️ Liên hệ ngay nếu có các triệu chứng:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #721c24; line-height: 1.8;">
                            <li>Chóng mặt, hoa mắt kéo dài</li>
                            <li>Chảy máu hoặc bầm tím tại vị trí lấy máu</li>
                            <li>Sốt hoặc cảm thấy không khỏe</li>
                        </ul>
                    </div>
                    
                    <!-- Contact -->
                    <div style="background-color: #e7f3ff; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <h3 style="color: #004085; margin: 0 0 10px 0;">📞 Cần hỗ trợ?</h3>
                        <p style="margin: 0; color: #004085;">Hotline: <strong>0123 456 789</strong></p>
                        <p style="margin: 5px 0 0 0; color: #004085;">Email: <a href="mailto:daivietblood@gmail.com" style="color: #007bff;">support@bloodcenter.com</a></p>
                    </div>
                    
                    <!-- Closing -->
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #6c757d; font-style: italic; margin: 0;">"Mỗi giọt máu cho đi - Một cuộc đời ở lại"</p>
                        <p style="color: #dc3545; font-weight: bold; margin: 15px 0 0 0;">❤️ Trân trọng cảm ơn bạn! ❤️</p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-weight: bold;">Trung tâm Hiến máu Đại Việt Blood</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px;">"Giọt máu nghĩa tình - Trao sự sống, nhận hạnh phúc"</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px;">Địa chỉ: Lô E2a-8, Đường D1, Khu Công nghệ cao, Phường Tăng Nhơn Phú, TP. HCM</p>
                </div>
            </div>
        `;

        const response = await sendEmailService(donorEmail, subject, htmlContent);
        res.status(200).json({
            status: 'success',
            message: 'Recovery reminder email sent successfully',
            response,
        });
    } catch (error) {
        console.error('Error in sendRecoveryReminderEmail:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};
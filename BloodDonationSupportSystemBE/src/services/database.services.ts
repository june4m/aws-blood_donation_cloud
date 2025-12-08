import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

class DatabaseServices {
  private static instance: DatabaseServices
  private pool: Pool

  private constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_SERVER!,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    })

    // Test connection
    this.pool.getConnection()
      .then((conn: PoolConnection) => {
        console.log('Connected to MySQL Database')
        conn.release()
      })
      .catch((err: Error) => console.error('Database connect error', err))
  }

  public static getInstance(): DatabaseServices {
    if (!DatabaseServices.instance) {
      DatabaseServices.instance = new DatabaseServices()
    }
    return DatabaseServices.instance
  }

  public async query(queryText: string, params?: any[]): Promise<any> {
    try {
      const [rows] = await this.pool.execute<RowDataPacket[]>(queryText, params || [])
      return rows
    } catch (error) {
      console.error('Query error:', error)
      throw error
    }
  }

  public async queryParam(queryText: string, params?: any[]): Promise<any> {
    try {
      const [result] = await this.pool.execute<ResultSetHeader>(queryText, params || [])
      return {
        recordset: Array.isArray(result) ? result : [],
        rowsAffected: [result.affectedRows],
        affectedRows: result.affectedRows
      }
    } catch (error) {
      console.error('QueryParam error:', error)
      throw error
    }
  }

  public async getConnection(): Promise<PoolConnection> {
    return this.pool.getConnection()
  }

  public async close(): Promise<void> {
    await this.pool.end()
  }
}

export default DatabaseServices.getInstance()

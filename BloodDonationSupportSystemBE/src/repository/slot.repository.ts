import { Appointment } from '~/models/schemas/slot.schema'
import databaseServices from '../services/database.services'
import Database from '../services/database.services'

export class SlotRepository {
  async createSlot(slotData: any) {
    console.log('CreateSlot Repository')

    const { ...fields } = slotData

    // Kiểm tra slot đã tồn tại với cùng ngày và khung giờ
    const checkDuplicateQuery = `
      SELECT COUNT(*) AS count
      FROM Slot
      WHERE Slot_Date = ? AND Start_Time = ? AND End_Time = ?
    `
    const duplicateResult = await Database.query(checkDuplicateQuery, [
      fields.Slot_Date,
      fields.Start_Time,
      fields.End_Time
    ])

    if (duplicateResult[0]?.count > 0) {
      throw new Error('Ca hiến máu với ngày và khung giờ này đã tồn tại!')
    }

    // Generate new Slot_ID
    let newSlotId = 'S001'
    const lastId = `
      SELECT Slot_ID
      FROM Slot
      ORDER BY CAST(SUBSTRING(Slot_ID, 2, LENGTH(Slot_ID) - 1) AS UNSIGNED) DESC
      LIMIT 1
    `

    const lastIdResult = await Database.query(lastId)
    if (lastIdResult.length > 0) {
      const lastSlotId = lastIdResult[0].Slot_ID
      const numericPart = parseInt(lastSlotId.slice(1))
      const nextId = numericPart + 1
      newSlotId = 'S' + String(nextId).padStart(3, '0')
    }

    try {
      const insertQuery = `
        INSERT INTO Slot (Slot_ID, Slot_Date, Start_Time, Volume, Max_Volume, End_Time, Status, Admin_ID)
        VALUES (?, ?, ?, '0', '200', ?, 'A', 'U001')
      `
      const params = [newSlotId, fields.Slot_Date, fields.Start_Time, fields.End_Time]
      const result = await Database.queryParam(insertQuery, params)
      console.log('Repository', result)

      return result
    } catch (error) {
      throw error
    }
  }

  async getSlot(status: string, formatTodayDate: string) {
    console.log('Slot repo')
    try {
      const slotData = await Database.query(
        `
        SELECT 
          Slot_ID, 
          Slot_Date, 
          TIME_FORMAT(Start_Time, '%H:%i:%s') AS Start_Time, 
          Volume, 
          Max_Volume, 
          TIME_FORMAT(End_Time, '%H:%i:%s') AS End_Time, 
          Status, 
          Admin_ID
        FROM Slot 
        WHERE Status = ? AND DATE(Slot_Date) >= ?
        `,
        [status, formatTodayDate]
      )
      console.log(slotData)
      return slotData
    } catch (error) {
      throw error
    }
  }

  async registerSlot(appointmentData: Appointment) {
    console.log('register repo')
    let newAppointmentID = 'AP001'
    const lastId = `
      SELECT Appointment_ID
      FROM AppointmentGiving
      ORDER BY CAST(SUBSTRING(Appointment_ID, 3, LENGTH(Appointment_ID) - 2) AS UNSIGNED) DESC
      LIMIT 1
    `
    const lastIdResult = await Database.query(lastId)
    console.log('lastIdResult: ', lastIdResult)
    if (lastIdResult.length > 0) {
      const lastAppointmentID = lastIdResult[0].Appointment_ID
      const numericPart = parseInt(lastAppointmentID.slice(2))
      const nextId = numericPart + 1
      newAppointmentID = 'AP' + String(nextId).padStart(3, '0')
    }
    console.log('start try')
    try {
      const { ...fields } = appointmentData
      const insertQuery = `
        INSERT INTO AppointmentGiving (Appointment_ID, Slot_ID, User_ID, Status)
        VALUES (?, ?, ?, 'Pending')
      `
      const params = [newAppointmentID, fields.Slot_ID, fields.User_ID]
      const addAppointment = await Database.queryParam(insertQuery, params)
      console.log(addAppointment)
      return addAppointment
    } catch (error) {
      throw error
    }
  }

  public async getSlotById(slot_id: string) {
    console.log('getSlotById slotRepo')
    const query = `SELECT * FROM Slot WHERE Slot_ID = ?`
    console.log('slotRepo slot_id: ', slot_id)
    const result = await databaseServices.queryParam(query, [slot_id])
    console.log('getSlotById result: ', result)
    if (result && result.recordset && result.recordset.length > 0) {
      console.log('result.recordset[0]: ', result.recordset[0])
      return result.recordset[0]
    }
    return null
  }

  async getLastDonationByUserId(userId: string): Promise<{ donation_date: string; Status: string } | null> {
    const query = `
      SELECT
        AG.Appointment_ID,
        S.Slot_Date AS donation_date,
        AG.Status
      FROM AppointmentGiving AG
      JOIN Slot S ON AG.Slot_ID = S.Slot_ID
      WHERE AG.User_ID = ?
      ORDER BY S.Slot_Date DESC
      LIMIT 1
    `
    console.log('Query UserID: ', userId)
    const result = await Database.queryParam(query, [userId])
    console.log('Query Result:', result)
    return result.recordset[0] ?? null
  }
}

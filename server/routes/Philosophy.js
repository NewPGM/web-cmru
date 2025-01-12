// server/routes/Philosophys.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ฟังก์ชันทั่วไปสำหรับจัดการการทำงานกับฐานข้อมูล
async function executeQuery(query, params, res, successMessage) {
  try {
    const [results] = await pool.query(query, params);
    if (successMessage && results.affectedRows > 0) {
      res.status(201).send(successMessage);
    } else if (results.affectedRows === 0) {
      res.status(404).send('ไม่พบข้อมูลหรือไม่มีการเปลี่ยนแปลง');
    } else {
      res.json(results);
    }
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการดำเนินการฐานข้อมูล:', err.message);
    res.status(500).send('เกิดข้อผิดพลาดในเซิร์ฟเวอร์');
  }
}

// Get all Philosophy
router.get('/', async (req, res) => {
  const query = `
    SELECT 
      Philosophy_id,
      Philosophy_name
    FROM Philosophy
  `;
  await executeQuery(query, [], res);
});

// Add Philosophy
router.post('/', async (req, res) => {
  const { Philosophy_name } = req.body;

  // Validation
  if (!Philosophy_name ) {
    return res.status(400).send('กรุณาระบุปรัชญา');
  }

  try {
    // หา ID ถัดไป
    const [maxIdResult] = await pool.query('SELECT MAX(Philosophy_id) as max_id FROM Philosophy');
    const nextId = (maxIdResult[0].max_id || 0) + 1;

    const query = `
      INSERT INTO Philosophy (Philosophy_id, Philosophy_name) 
      VALUES (?, ?)
    `;
    await pool.query(query, [nextId, Philosophy_name || null]);
    res.status(201).send('เพิ่มข้อมูลสถานที่เรียบร้อยแล้ว');
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).send('มีข้อมูลสถานที่นี้ในระบบแล้ว');
    } else {
      res.status(500).send('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    }
  }
});

// Update Philosophy
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Philosophy_name } = req.body;

  if (!Philosophy_name ) {
    return res.status(400).send('กรุณาระบุชื่อสถานที่และอาคาร');
  }

  try {
    // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่
    const [PhilosophyCheck] = await pool.query(
      'SELECT Philosophy_id FROM Philosophy WHERE Philosophy_id = ?',
      [id]
    );
    if (PhilosophyCheck.length === 0) {
      return res.status(404).send('ไม่พบข้อมูลสถานที่');
    }

    const query = `
      UPDATE Philosophy
      SET Philosophy_name = ?
      WHERE Philosophy_id = ?
    `;
    await executeQuery(
      query, 
      [Philosophy_name || null, id],
      res,
      'อัปเดตข้อมูลสถานที่เรียบร้อยแล้ว'
    );
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).send('มีข้อมูลสถานที่นี้ในระบบแล้ว');
    } else {
      res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    }
  }
});

// Delete location
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // ตรวจสอบว่ามีการใช้งานอยู่หรือไม่
    // const [usageCheck] = await pool.query(
    //   'SELECT room_id FROM rooms WHERE location_id = ?',
    //   [id]
    // );
    // if (usageCheck.length > 0) {
    //   return res.status(400).send('ไม่สามารถลบได้เนื่องจากมีการใช้งานอยู่');
    // }

    const query = 'DELETE FROM Philosophy WHERE Philosophy_id = ?';
    await executeQuery(query, [id], res, 'ลบข้อมูลสถานที่เรียบร้อยแล้ว');
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', err.message);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(400).send('ไม่สามารถลบได้เนื่องจากมีการใช้งานอยู่');
    } else {
      res.status(500).send('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  }
});

module.exports = router;
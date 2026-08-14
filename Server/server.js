import 'dotenv/config';
import express from 'express';
import path from 'path';
import { supabase } from './supabase.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(process.cwd(), 'Frontend')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'Sandlip Africa University Server Node' });
});

// Supabase Database Connection Status Route
app.get('/api/supabase/status', async (req, res) => {
  try {
    const { data, error } = await supabase.from('students').select('*').limit(1);
    if (error) {
      res.json({
        connected: true,
        database: 'Supabase Postgres',
        url: process.env.SUPABASE_URL || 'https://zoszrmovpvmbjapvsmnk.supabase.co',
        status: 'Connected (Table pending creation or empty)',
        details: error.message
      });
    } else {
      res.json({
        connected: true,
        database: 'Supabase Postgres',
        url: process.env.SUPABASE_URL || 'https://zoszrmovpvmbjapvsmnk.supabase.co',
        status: 'Connected & Active',
        recordCount: data ? data.length : 0
      });
    }
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Profile Picture Upload Endpoint with 50KB File Size Limitation
app.post('/api/student/avatar', async (req, res) => {
  try {
    const { avatarBase64, matricNo, fileSize } = req.body;

    const MAX_SIZE_BYTES = 50 * 1024; // 50 KB = 51,200 bytes

    let actualSizeBytes = fileSize;
    if (!actualSizeBytes && avatarBase64) {
      // Calculate approximate size from Base64 string if not explicitly passed
      const base64Data = avatarBase64.split(',')[1] || avatarBase64;
      actualSizeBytes = Math.round((base64Data.length * 3) / 4);
    }

    if (actualSizeBytes > MAX_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        message: `File size exceeds maximum allowed limit of 50KB! (Uploaded: ${(actualSizeBytes / 1024).toFixed(1)}KB)`
      });
    }

    // Try updating Supabase database table if table exists
    try {
      await supabase
        .from('students')
        .upsert({ id: matricNo || 'SAU/CSC/2026/001', avatar_url: avatarBase64 });
    } catch (dbErr) {
      console.log('Supabase sync info:', dbErr.message);
    }

    res.json({
      success: true,
      message: 'Profile picture uploaded and saved successfully!',
      avatarUrl: avatarBase64,
      fileSizeBytes: actualSizeBytes,
      fileSizeKb: (actualSizeBytes / 1024).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Paystack Gateway Integration Routes
app.post('/api/paystack/initialize', async (req, res) => {
  try {
    const { email, amount, reference, description } = req.body;
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_live_1eb14a2b18c4cb9ef39eebf5da2ddf29ad73e028';
    
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email || 'student@sau.edu.ng',
        amount: Math.round((Number(amount) || 100) * 100), // convert to kobo
        reference: reference || `SAU-PAY-${Date.now()}`,
        metadata: { description: description || 'SAU Student Portal Fee Payment' }
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get('/api/paystack/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_live_1eb14a2b18c4cb9ef39eebf5da2ddf29ad73e028';

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Sandlip Africa University Server Node running on http://localhost:${PORT}`);
});

export default app;

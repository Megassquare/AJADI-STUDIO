/**
 * Serverless Contact Dispatch Handler (Vercel / Netlify Functions)
 * Route: POST /api/contact
 * 
 * Never hardcodes API keys or passwords.
 * Reads RESEND_API_KEY from environment variables.
 */

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      projectType,
      description,
      referenceUrl,
      deadline,
      budget,
      additionalInfo
    } = req.body || {};

    // Validate required fields
    if (!name || !email || !projectType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Please fill out name, email, project type, and description.'
      });
    }

    // Server-side email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const recipientEmail = 'ajadistudioo@gmail.com';
    const apiKey = process.env.RESEND_API_KEY;

    // Guard: Ensure environment variable is set
    if (!apiKey) {
      console.error('Server Configuration Error: RESEND_API_KEY environment variable is not set.');
      return res.status(500).json({
        success: false,
        message: 'The email service is currently being configured. Please email ajadistudioo@gmail.com directly.'
      });
    }

    // Build structured email body
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #07080a; margin-top: 0; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">New 3D Project Inquiry</h2>
        <p><strong>From:</strong> ${escapeHtml(name)} (<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>)</p>
        <p><strong>Category:</strong> ${escapeHtml(projectType)}</p>
        <p><strong>Timeline:</strong> ${escapeHtml(deadline || 'Not specified')}</p>
        <p><strong>Budget Range:</strong> ${escapeHtml(budget || 'Not specified')}</p>
        
        <h3 style="margin-top: 24px; color: #333;">Project Scope</h3>
        <div style="background: #f8fafc; padding: 16px; border-radius: 6px; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(description)}</div>
        
        ${referenceUrl ? `<p style="margin-top: 16px;"><strong>References:</strong> <a href="${escapeHtml(referenceUrl)}" target="_blank">${escapeHtml(referenceUrl)}</a></p>` : ''}
        ${additionalInfo ? `<p style="margin-top: 16px;"><strong>Additional Requirements:</strong> ${escapeHtml(additionalInfo)}</p>` : ''}
        
        <hr style="margin-top: 32px; border: none; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 0;">Sent directly from the AJADI STUDIO website inquiry form.</p>
      </div>
    `;

    // Forward through Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AJADI STUDIO Inquiries <onboarding@resend.dev>',
        to: [recipientEmail],
        reply_to: email,
        subject: `[Inquiry] ${projectType} - ${name}`,
        html: emailHtml
      })
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error('Resend delivery failure:', resData);
      return res.status(500).json({
        success: false,
        message: 'Could not deliver email to the studio inbox. Please email ajadistudioo@gmail.com directly.'
      });
    }

    return res.status(200).json({ success: true, message: 'Inquiry delivered.' });

  } catch (error) {
    console.error('Server error handling inquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing your inquiry. Please email ajadistudioo@gmail.com directly.'
    });
  }
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
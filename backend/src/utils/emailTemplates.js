export const generateEmailTemplate = (title, bodyContent) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
            .header { text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #333; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; margin: 0; }
            .content { font-size: 16px; color: #555; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            .btn { display: inline-block; background-color: #333; color: #D4AF37; padding: 12px 25px; text-decoration: none; border-radius: 4px; margin-top: 20px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Glow & Grace</h1>
            </div>
            <div class="content">
                <h2>${title}</h2>
                <div style="margin-top: 20px;">
                    ${bodyContent}
                </div>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Glow & Grace Beauty Parlour. All rights reserved.</p>
                <p>123 Beauty Lane, Glamour City</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

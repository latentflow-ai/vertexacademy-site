import nodemailer from 'nodemailer';

interface EnrollmentInquiry {
    fullName: string;
    email: string;
    phone: string;
    studentName: string;
    grade: string;
    program: string;
    preferredDate: string;
    message: string;
}

interface CampusVisitRequest {
    name: string;
    email: string;
    phone: string;
    preferredDate: string;
    numberOfStudents: string;
    message: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEnrollmentInquiryNotification(inquiry: EnrollmentInquiry): Promise<boolean> {
        try {
            const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            New Enrollment Inquiry
          </h2>
          
          <div style="margin: 20px 0; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p><strong>Student Name:</strong> ${inquiry.studentName}</p>
            <p><strong>Current Grade:</strong> ${inquiry.grade}</p>
            <p><strong>Interested Program:</strong> ${inquiry.program}</p>
            <p><strong>Preferred Enrollment Date:</strong> ${inquiry.preferredDate}</p>
          </div>

          <div style="margin: 20px 0; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <h3 style="color: #2c3e50; margin-top: 0;">Parent/Guardian Details</h3>
            <p><strong>Name:</strong> ${inquiry.fullName}</p>
            <p><strong>Email:</strong> ${inquiry.email}</p>
            <p><strong>Phone:</strong> ${inquiry.phone}</p>
          </div>

          <div style="margin: 20px 0; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <h3 style="color: #2c3e50; margin-top: 0;">Additional Message</h3>
            <p>${inquiry.message || 'No additional message provided'}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>This is an automated inquiry from the Vertex Academy website.</p>
            <p>Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      `;

            await this.transporter.sendMail({
                from: `${process.env.SMTP_FROM_NAME || 'Vertex Academy'} <${process.env.SMTP_USER}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `🎓 New Enrollment Inquiry - ${inquiry.studentName}`,
                html: htmlContent,
                replyTo: inquiry.email,
            });

            // Send confirmation email to user
            await this.sendConfirmationEmail(
                inquiry.email,
                inquiry.fullName,
                'Enrollment Inquiry'
            );

            return true;
        } catch (error: any) {
            console.error('Error sending enrollment inquiry email:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    async sendCampusVisitNotification(request: CampusVisitRequest): Promise<boolean> {
        try {
            const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            New Campus Visit Request
          </h2>
          
          <div style="margin: 20px 0; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <h3 style="color: #2c3e50; margin-top: 0;">Visitor Details</h3>
            <p><strong>Name:</strong> ${request.name}</p>
            <p><strong>Email:</strong> ${request.email}</p>
            <p><strong>Phone:</strong> ${request.phone}</p>
            <p><strong>Number of Students:</strong> ${request.numberOfStudents}</p>
            <p><strong>Preferred Visit Date:</strong> ${request.preferredDate}</p>
          </div>

          <div style="margin: 20px 0; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <h3 style="color: #2c3e50; margin-top: 0;">Additional Message</h3>
            <p>${request.message || 'No additional message provided'}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>This is an automated campus visit request from the Vertex Academy website.</p>
            <p>Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      `;

            await this.transporter.sendMail({
                from: `${process.env.SMTP_FROM_NAME || 'Vertex Academy'} <${process.env.SMTP_USER}>`,
                to: process.env.ADMIN_EMAIL,
                subject: ` New Campus Visit Request - ${request.name}`,
                html: htmlContent,
                replyTo: request.email,
            });

            // Send confirmation email to user
            await this.sendConfirmationEmail(
                request.email,
                request.name,
                'Campus Visit'
            );

            return true;
        } catch (error: any) {
            console.error('Error sending campus visit email:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    private async sendConfirmationEmail(
        toEmail: string,
        userName: string,
        inquiryType: string
    ): Promise<void> {
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Thank You, ${userName}!</h2>
        
        <p>We have received your ${inquiryType.toLowerCase()} request and will get back to you shortly.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #d4edda; border-left: 4px solid #28a745; border-radius: 3px;">
          <p style="margin: 0; color: #155724;">✓ Your request has been successfully submitted</p>
        </div>

        <p>Our team will review your ${inquiryType.toLowerCase()} and contact you within 24 hours at the phone number or email you provided.</p>

        <!-- 🔧 CUSTOMIZE THIS SECTION -->
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Best regards,<br/>
          <strong>Management, Vertex Academy </strong><br/>
           Thiruvanmiyur, Chennai<br/>
           Phone: +91 XXXXX XXXXX<br/>
           Email: info@vertexacademy.com<br/>
           Website: www.vertexacademy.com
        </p>
        <!-- END CUSTOMIZE -->
      </div>
    `;

        await this.transporter.sendMail({
            from: `${process.env.SMTP_FROM_NAME || 'Vertex Academy'} <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: `${inquiryType} Request Confirmation - Vertex Academy`,
            html: htmlContent,
        });
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('✓ Email service connected successfully');
            return true;
        } catch (error: any) {
            console.error('❌ Email service connection failed:', error.message);
            return false;
        }
    }
}

export default new EmailService();

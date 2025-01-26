import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate.js"
import { mailtrapClient,sender } from "./mailtrap.config.js"

export const senderVerificationEmail = async(VERIFICATION_EMAIL_TEMPLATE, verificationToken)=>{
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category: "Email Verification",
        })
        console.log("Email sent successfully",response);
        
    } catch (error) {
        console.log("Error in sending verification Email",error);   
    }
}

export const sendWelcomeEmail = async(email,name)=>{
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid:"e65925d1-a9d1-4a40-ae7c-d92b37d593df",
            template_variables:{
                company_info_name : "AuthCompany",
                name: name
            }
        })
        console.log("Welcome Email sent successfully",response);
        
    } catch (error) {
        console.log("Error in sending welcome email",error);
        
    }
}

export const sendPasswordResetEmail = async (email,resetURL)=>{
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
        })
    } catch (error) {
        console.log("Error in sending password reset email");
        
    }
}

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};
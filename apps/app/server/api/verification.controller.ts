import { config } from "dotenv";
import { db } from "../db/setup";
import { insertEmailSchema, email } from "../db/schema";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND);

/**
 * @param address
 * @returns response
 */
export const sendVerification = async (address: string, code: number) => {
    try {
        sendCode(address, code)
        return "success";
    } catch (error) {
        return "negligible"
    }
}

const sendCode = (address: string, code: number) => {
    const message = `
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap");

        body {
            background-color: #fff;
            color: #000;
            font-family: "Space Grotesk", sans-serif;
            margin: 0;
            padding: 20px;
        }

        h1,
        h2 {
            margin: 10px 0;
        }

        h1 {
            font-size: 24px;
        }

        h2 {
            font-size: 20px;
        }

        p {
            line-height: 1.5;
        }

        a {
            color: #809fff;
            text-decoration: none;
        }

        a:hover {
            color: #809fff;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        li {
            margin-bottom: 10px;
        }

        a img {
            width: 32px;
            height: 32px;
        }

        .contact {
            min-width: 512px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    </style>
    <body>
        <div class="contact">
            <div>
                <h3>Hey there,</h3>
                <p>
                    Here's your verification code: ${code}.
                </p>

                <p>We're excited to have you on board!</p>
                <p>The ZERO Team</p>
            </div>
                
        </div>
    </body>
    </html>
    `
    resend.emails.send({
        from: 'ZΞRO Protocol <no-reply@0xzero.org>',
        to: address,
        subject: 'ZERO Verification Code',
        html: message
    });
}


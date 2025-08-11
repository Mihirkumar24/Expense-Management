export function approveReportMailTemplate(reportId, reportName) {
    return (
        `<!DOCTYPE html>
<html lang='en'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Report</title>
    <style>
        body {
            font-family: system-ui;
            background-color: hsl(0, 0%, 90%);
        }

        .email-container {
            background-color: hsl(0, 0%, 100%);
            padding: 1.5rem;
            max-width: 24rem;
            margin: auto;
            border-radius: 0.5rem;
        }

        .message {
            font-size: 1rem;
            margin-bottom: 1.5rem;
        }

        .button {
            padding: 0.5rem 1rem;
            font-size: 1rem;
            color: white;
            background-color: blue;
            text-decoration: none;
            border-radius: 4px;
        }

        .footer {
            font-size: 0.75rem;
            color: gray;
            margin-top: 1.5rem;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class='email-container'>
        <p class='message'>
            The report <strong>${reportName}</strong> has been approved.
        </p>

        <a href='${process.env.CLIENT_URL}/reports/${reportId}' class='button'>View Report</a>

        <div class='footer'>
            This is an auto generated email. Please do not reply.
        </div>
    </div>
</body>

</html>`
    );
}

export function approveAndForwardReportMailTemplate(approver, reportId, reportName, submitter) {
    return (
        `<!DOCTYPE html>
<html lang='en'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Report</title>
    <style>
        body {
            font-family: system-ui;
            background-color: hsl(0, 0%, 90%);
        }

        .email-container {
            background-color: hsl(0, 0%, 100%);
            padding: 1.5rem;
            max-width: 24rem;
            margin: auto;
            border-radius: 0.5rem;
        }

        .message {
            font-size: 1rem;
            margin-bottom: 1.5rem;
        }

        .button {
            padding: 0.5rem 1rem;
            font-size: 1rem;
            color: white;
            background-color: blue;
            text-decoration: none;
            border-radius: 4px;
        }

        .footer {
            font-size: 0.75rem;
            color: gray;
            margin-top: 1.5rem;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class='email-container'>
        <p class='message'>
            The report <strong>${reportName}</strong> submitted by <strong>${submitter}</strong> has been forwarded to you by
            <strong>${approver}</strong> for further approval.
        </p>

        <a href='${process.env.CLIENT_URL}/reports/${reportId}' class='button'>View Report</a>

        <div class='footer'>
            This is an auto generated email. Please do not reply.
        </div>
    </div>
</body>

</html>`
    );
}

export function invitationMailTemplate(invitationToken, organization) {
    return (
        `<!DOCTYPE html>
<html lang='en'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Report</title>
    <style>
        body {
            font-family: system-ui;
            background-color: hsl(0, 0%, 90%);
        }

        .email-container {
            background-color: hsl(0, 0%, 100%);
            padding: 1.5rem;
            max-width: 24rem;
            margin: auto;
            border-radius: 0.5rem;
        }

        .message {
            font-size: 1rem;
            margin-bottom: 1.5rem;
        }

        .button {
            padding: 0.5rem 1rem;
            font-size: 1rem;
            color: white;
            background-color: blue;
            text-decoration: none;
            border-radius: 4px;
        }

        .footer {
            font-size: 0.75rem;
            color: gray;
            margin-top: 1.5rem;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class='email-container'>
        <p class='message'>
            You have been invited by the administrator of <strong>${organization}</strong> to join their organization.
        </p>

        <a href='${process.env.CLIENT_URL}/invitation/${invitationToken}' class='button'>Accept Invitation</a>

        <div class='footer'>
            This is an auto generated email. Please do not reply.
        </div>
    </div>
</body>

</html>`
    );
}

export function rejectReportMailTemplate(approver, reportId, reportName) {
    return (
        `<!DOCTYPE html>
<html lang='en'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Report</title>
    <style>
        body {
            font-family: system-ui;
            background-color: hsl(0, 0%, 90%);
        }

        .email-container {
            background-color: hsl(0, 0%, 100%);
            padding: 1.5rem;
            max-width: 24rem;
            margin: auto;
            border-radius: 0.5rem;
        }

        .message {
            font-size: 1rem;
            margin-bottom: 1.5rem;
        }

        .button {
            padding: 0.5rem 1rem;
            font-size: 1rem;
            color: white;
            background-color: blue;
            text-decoration: none;
            border-radius: 4px;
        }

        .footer {
            font-size: 0.75rem;
            color: gray;
            margin-top: 1.5rem;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class='email-container'>
        <p class='message'>
            The report <strong>${reportName}</strong> has been rejected by <strong>${approver}</strong>.
        </p>

        <a href='${process.env.CLIENT_URL}/reports/${reportId}' class='button'>View Report</a>

        <div class='footer'>
            This is an auto generated email. Please do not reply.
        </div>
    </div>
</body>

</html>`
    );
}

export function submitReportMailTemplate(reportId, reportName, submitter) {
    return (
        `<!DOCTYPE html>
<html lang='en'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Report</title>
    <style>
        body {
            font-family: system-ui;
            background-color: hsl(0, 0%, 90%);
        }

        .email-container {
            background-color: hsl(0, 0%, 100%);
            padding: 1.5rem;
            max-width: 24rem;
            margin: auto;
            border-radius: 0.5rem;
        }

        .message {
            font-size: 1rem;
            margin-bottom: 1.5rem;
        }

        .button {
            padding: 0.5rem 1rem;
            font-size: 1rem;
            color: white;
            background-color: blue;
            text-decoration: none;
            border-radius: 4px;
        }

        .footer {
            font-size: 0.75rem;
            color: gray;
            margin-top: 1.5rem;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class='email-container'>
        <p class='message'>
            The report <strong>${reportName}</strong> has been submitted by <strong>${submitter}</strong> for approval.
        </p>

        <a href='${process.env.CLIENT_URL}/reports/${reportId}' class='button'>View Report</a>

        <div class='footer'>
            This is an auto generated email. Please do not reply.
        </div>
    </div>
</body>

</html>`
    );
}
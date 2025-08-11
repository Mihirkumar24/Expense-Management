import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema({
    defaultCurrency: {
        type: 'String',
        default: 'usd',
        required: [true, 'Default currency is required']
    }
});

const userSchema = new mongoose.Schema({
    approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [
            function () {
                return this.role !== 'administrator';
            },
            'Approver is required.'
        ]
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    email: {
        type: String,
        required: 'Email is required.'
    },
    firstName: {
        type: String,
        required: 'First name is required.'
    },
    invitationTokenHash: {
        type: String,
        select: false
    },
    invitationTokenHashExpiryDate: {
        type: Date,
        select: false
    },
    lastName: {
        type: String,
        required: 'Last name is required.'
    },
    level: {
        type: Number,
        default: 1,
        required: 'Level is required.'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: 'Organization is required.'
    },
    password: {
        type: String,
        required: [
            function () {
                return this.status === 'active';
            },
            'Password is required.'
        ],
        select: false
    },
    policy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy',
        required: 'Policy is required.'
    },
    preference: preferenceSchema,
    role: {
        type: String,
        enum: ['administrator', 'approver', 'submitter'],
        required: 'Role is required.'
    },
    resetPasswordTokenHash: {
        type: String,
        select: false
    },
    resetPasswordTokenHashExpiryDate: {
        type: Date,
        select: false
    },
    status: {
        type: String,
        default: 'invited',
        enum: ['active', 'inactive', 'invited'],
        required: 'Status is required.'
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
});

userSchema.pre('save', async function () {
    if (this.status === 'active' && (this.$isNew || this.isModified('password'))) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
});

userSchema.method('generateInvitationToken', function () {
    const invitationToken = crypto.randomBytes(32).toString('hex');

    this.invitationTokenHash = crypto.createHash('sha256').update(invitationToken).digest('hex');

    this.invitationTokenHashExpiryDate = Date.now() + 7 * 24 * 60 * 60 * 1000;

    return invitationToken;
});

userSchema.method('generateJwt', function () {
    return jwt.sign(
        { userId: this.id, },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
});

userSchema.method('generateResetPasswordToken', function () {
    const resetPasswordToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordTokenHash = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');

    this.resetPasswordTokenHashExpiryDate = Date.now() + 7 * 24 * 60 * 60 * 1000;

    return resetPasswordToken;
});

userSchema.method('validatePassword', function (password) {
    return bcrypt.compareSync(password, this.password);
});

export default mongoose.model('User', userSchema);
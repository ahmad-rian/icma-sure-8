export interface Country {
    id: string;
    name: string;
    code: string;
    iso_code: string;
    phone_code: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    is_allowed: boolean;
    role: 'admin' | 'user';
    google_id?: string | null;
    phone_number?: string | null;
    created_at: string;
    updated_at: string;
    profile?: UserProfile;
}

export interface UserProfile {
    id: string;
    user_id: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    bio?: string;
    avatar?: string;
    country_id?: string;
    country?: Country;
    created_at: string;
    updated_at: string;
}

export interface SubmissionContributor {
    id: string;
    submission_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    affiliation: string;
    country_id: string;
    country?: Country;
    is_primary_contact: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface SubmissionPayment {
    id: string;
    submission_id: string;
    amount: number;
    payment_proof?: string;
    status: 'pending' | 'approved' | 'rejected';
    uploaded_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    admin_notes?: string;
    reviewer?: User;
    created_at: string;
    updated_at: string;
}

export interface EmailNotification {
    id: string;
    submission_id: string;
    user_id: string;
    sender_id?: string;
    type: string;
    subject: string;
    body: string;
    status: 'pending' | 'sent' | 'failed';
    sent_at?: string;
    created_at: string;
    updated_at: string;
    sender?: User;
}

export interface AbstractSubmission {
    id: string;
    user_id: string;
    country_id?: string;
    author_first_name?: string;
    author_last_name?: string;
    author_email?: string;
    author_affiliation?: string;
    title: string;
    abstract: string;
    abstract_pdf?: string;
    keywords: string[];
    submission_file?: string;
    author_phone_number?: string;
    status: 'pending' | 'under_review' | 'approved' | 'rejected';
    reviewer_notes?: string;
    submitted_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    registration_fee?: number;
    payment_required: boolean;
    created_at: string;
    updated_at: string;
    
    // Relations
    user?: User;
    country?: Country;
    reviewer?: User;
    contributors?: SubmissionContributor[];
    payment?: SubmissionPayment;
    emailNotifications?: EmailNotification[];
}

export interface PaginatedSubmissions {
    data: AbstractSubmission[];
    links: PaginationLink[];
    meta: PaginationMeta;
}

export interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}
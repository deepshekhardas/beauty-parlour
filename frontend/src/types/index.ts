export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    token?: string;
}

export interface Service {
    _id: string;
    name: string;
    category: string;
    description: string;
    duration_minutes: number;
    base_price: number;
    is_active: boolean;
}

export interface Staff {
    _id: string;
    name: string;
    role: string;
    specialization: string[];
    image: string;
    is_active: boolean;
}

export interface GalleryItem {
    _id: string;
    title: string;
    category: string;
    image: string;
}

export interface Testimonial {
    _id: string;
    customer_name: string;
    rating: number;
    comment: string;
    is_featured: boolean;
}

export interface Appointment {
    _id: string;
    customer_name: string;
    customer_phone: string;
    service_id: Service | string;
    staff_id?: Staff | string;
    service_snapshot?: {
        name: string;
        price: number;
    };
    date: string;
    time_slot: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
}

export interface AnalyticsData {
    summary: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
    popularServices: Array<{
        _id: string;
        count: number;
    }>;
}

import mongoose from 'mongoose';
declare global {
    var __mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}
export declare const ensureCategoriesExist: () => Promise<void>;
export declare const ensureAdminsExist: () => Promise<void>;
export declare const isDbConnected: () => boolean;
export declare const getDbStatus: () => {
    connected: boolean;
    readyState: number;
    host?: string;
    database?: string;
};
export declare const connectDB: () => Promise<void>;
export default connectDB;
//# sourceMappingURL=db.d.ts.map
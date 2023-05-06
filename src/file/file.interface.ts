export interface FileObject {
  id: string;
  original_name: string;
  mimetype: string;
  size: number;
  s3_key: string;
  created_at: Date;
}

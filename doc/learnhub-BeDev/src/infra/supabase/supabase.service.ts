import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { QueryOptions, StorageOptions } from './supabase.types';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;
  private adminClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Regular client with anon key for normal operations
    this.client = createClient(supabaseUrl, supabaseAnonKey);
    
    // Admin client with service role key for admin operations
    this.adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
  }

  getClient(useAdmin = false) {
    return useAdmin ? this.adminClient : this.client;
  }

  // Generic CRUD operations
  async create<T>(table: string, data: Partial<T>, useAdmin = false): Promise<T> {
    const { data: result, error } = await this.getClient(useAdmin)
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  }

  async findOne<T>(table: string, id: string, useAdmin = false): Promise<T | null> {
    const { data, error } = await this.getClient(useAdmin)
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as T;
  }

  async findMany<T>(
    table: string,
    options: QueryOptions = {},
    useAdmin = false
  ): Promise<{ data: T[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      orderBy = 'created_at',
      orderDirection = 'desc'
    } = options;

    const offset = (page - 1) * limit;

    let query = this.getClient(useAdmin)
      .from(table)
      .select('*', { count: 'exact' })
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data as T[], count: count || 0 };
  }

  async update<T>(
    table: string,
    id: string,
    data: Partial<T>,
    useAdmin = false
  ): Promise<T> {
    const { data: result, error } = await this.getClient(useAdmin)
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  }

  async delete(table: string, id: string, useAdmin = false): Promise<void> {
    const { error } = await this.getClient(useAdmin)
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // File storage operations
  async uploadFile(
    file: Buffer,
    fileName: string,
    options: StorageOptions = {}
  ): Promise<string> {
    const {
      bucket = 'public',
      path = '',
      upsert = false
    } = options;

    const filePath = path ? `${path}/${fileName}` : fileName;
    
    const { error: uploadError, data } = await this.adminClient.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert,
        contentType: this.getContentType(fileName),
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = this.adminClient.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async deleteFile(
    fileName: string,
    options: StorageOptions = {}
  ): Promise<void> {
    const { bucket = 'public', path = '' } = options;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error } = await this.adminClient.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
  }

  private getContentType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif'
    };

    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}
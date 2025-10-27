import * as fs from "fs";
import * as path from "path";

/**
 * Cache metadata structure
 */
export interface CacheMetadata {
  version: string;
  lastUpdate: string;
  sdkVersion: string;
}

/**
 * Cache utility for reading and writing JSON files
 */
export class CacheManager {
  private directory: string;
  private ttl: number;

  constructor(directory: string, ttl: number = 86400000) {
    this.directory = directory;
    this.ttl = ttl;
  }

  /**
   * Ensure cache directory exists
   */
  private ensureDirectory(): void {
    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory, { recursive: true });
    }
  }

  /**
   * Get full path for a cache file
   */
  private getFilePath(filename: string): string {
    return path.join(this.directory, filename);
  }

  /**
   * Write data to JSON file
   */
  writeJSON<T>(filename: string, data: T): void {
    this.ensureDirectory();
    const filePath = this.getFilePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  /**
   * Read data from JSON file
   */
  readJSON<T>(filename: string): T | null {
    const filePath = this.getFilePath(filename);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as T;
    } catch (error) {
      console.error(`Failed to read cache file ${filename}:`, error);
      return null;
    }
  }

  /**
   * Check if cache file exists
   */
  exists(filename: string): boolean {
    return fs.existsSync(this.getFilePath(filename));
  }

  /**
   * Get age of cache file in milliseconds
   */
  getAge(filename: string): number | null {
    const filePath = this.getFilePath(filename);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const stats = fs.statSync(filePath);
    return Date.now() - stats.mtime.getTime();
  }

  /**
   * Check if cache is expired
   */
  isExpired(filename: string): boolean {
    const age = this.getAge(filename);
    if (age === null) {
      return true;
    }
    return age > this.ttl;
  }

  /**
   * Delete a cache file
   */
  delete(filename: string): void {
    const filePath = this.getFilePath(filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Clear all cache files
   */
  clearAll(): void {
    if (fs.existsSync(this.directory)) {
      const files = fs.readdirSync(this.directory);
      files.forEach((file) => {
        fs.unlinkSync(path.join(this.directory, file));
      });
    }
  }

  /**
   * Get cache status for all known files
   */
  getStatus(): Record<string, { exists: boolean; age: number | null; expired: boolean }> {
    const files = ["countries.json", "cities.json", "offices.json", "streets.json", "quarters.json", "metadata.json"];

    const status: Record<string, { exists: boolean; age: number | null; expired: boolean }> = {};

    files.forEach((file) => {
      status[file.replace(".json", "")] = {
        exists: this.exists(file),
        age: this.getAge(file),
        expired: this.isExpired(file),
      };
    });

    return status;
  }

  /**
   * Write metadata file
   */
  writeMetadata(sdkVersion: string): void {
    const metadata: CacheMetadata = {
      version: "1.0",
      lastUpdate: new Date().toISOString(),
      sdkVersion,
    };
    this.writeJSON("metadata.json", metadata);
  }

  /**
   * Read metadata file
   */
  readMetadata(): CacheMetadata | null {
    return this.readJSON<CacheMetadata>("metadata.json");
  }
}

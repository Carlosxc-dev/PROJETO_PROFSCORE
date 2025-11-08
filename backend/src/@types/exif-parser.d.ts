declare module "exif-parser" {
  interface ExifTags {
    [key: string]: string | number | Date;
  }

  interface ExifResult {
    tags: ExifTags;
    imageSize?: {
      height: number;
      width: number;
    };
    thumbnailOffset?: number;
    thumbnailLength?: number;
  }

  interface ExifParser {
    parse(): ExifResult;
  }

  namespace ExifParser {
    function create(buffer: Buffer): ExifParser;
  }

  export = ExifParser;
}

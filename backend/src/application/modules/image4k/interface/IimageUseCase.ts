import { 
  InputDTOCreateImage4k, 
  InputDTOUpdateImage4k, 
  InputDTODeleteImage4k, 
  InputDTOGetImage4kById 
} from "../inputDTO/Image4kInputDTOs";

import { 
  OutputDTOCreateImage4k, 
  OutputDTOUpdateImage4k, 
  OutputDTODeleteImage4k, 
  OutputDTOGetImage4kById, 
  OutputDTOListImage4k 
} from "../outputDTO/image4kOutputsDTOs";

export interface IImage4kUseCase {
  createImage4k(createImage4kDTO: InputDTOCreateImage4k): Promise<OutputDTOCreateImage4k>;
  getImage4kById(getImage4kByIdDTO: InputDTOGetImage4kById): Promise<OutputDTOGetImage4kById| null>;
  deleteImage4k(deleteImage4kDTO: InputDTODeleteImage4k): Promise<OutputDTODeleteImage4k>;
  updateImage4k(updateImage4kDTO: InputDTOUpdateImage4k): Promise<OutputDTOUpdateImage4k>;
  updateImage4kByIdFolder(input: string, status: string): Promise<any>;
}

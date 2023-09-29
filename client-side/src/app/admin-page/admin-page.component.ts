import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  productForm!: FormGroup;
  product = {
    name: '',
    category: '',
    price: 0,
    availability:'In Stock',
    rating: 4.5,
    description: '',
    image: []
  };
  clearButtonClicked: boolean = false;
  selectedImages: File[] = [];
  
  selectedImageUrls: string[] = [];

  constructor(private formBuilder: FormBuilder, private productService:ProductService) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: [this.product.name, Validators.required],
      category: [this.product.category],
      price: [this.product.price, Validators.required],
      availability: ['In Stock',Validators.required],
      description: [this.product.description, Validators.required],
      image: this.formBuilder.array([])
    });
  }
  onSubmit() {
    if (this.productForm.valid) {
      const imagesControl = this.productForm.get('image') as FormArray;

      for (const image of this.selectedImages) {
        imagesControl.push(this.formBuilder.control(image));
      }

       const productData = {
        ...this.product,
        ...this.productForm.value,
      };
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('category', productData.category);
    formData.append('price', productData.price);
    formData.append('rating',productData.rating);
    formData.append('availability', productData.availability);
    formData.append('description', productData.description);
    for (const image of this.selectedImages) {
      formData.append('image', image);
    }
     
    
      this.productService.addProduct(formData).subscribe(
        (response) => {
          console.log('Product added:', response);
          this.productForm.reset();
          this.selectedImages = [];
          this.selectedImageUrls = [];
        },
        (error) => {
          console.error('Error adding product:', error);
        }
      );

    } else {
      console.log('Form is not valid.');
    }

  }

  onFileChange(event: any) {
    const files: File[] = event.target.files;
    this.clearButtonClicked = false;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.selectedImages.push(files[i]);
        this.fileToImageUrl(files[i]);
      }
    }
  }



  private fileToImageUrl(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedImageUrls.push(reader.result as string);
    };

  }

  
  clearSelectedImages() {
    this.selectedImages = [];
    this.selectedImageUrls = [];
    this.clearButtonClicked = true;
  }

}

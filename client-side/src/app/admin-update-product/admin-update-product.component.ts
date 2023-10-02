import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-update-product',
  templateUrl: './admin-update-product.component.html',
  styleUrls: ['./admin-update-product.component.css']
})
export class AdminUpdateProductComponent implements OnInit {
  product!: Product;
  productId: string = '';
  productForm!: FormGroup;
  selectedImages: File[] = [];
  selectedImageUrls: string[] = [];
  clearButtonClicked: boolean = false;


  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {

    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      availability: ['', Validators.required],
      description: ['', Validators.required],
      image: this.formBuilder.array([])
    });

  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      console.log('Product ID:', this.productId);
      this.productService.getProductById(this.productId).subscribe(
        (data) => {
          this.product = data;
          this.selectedImages = [];
          this.selectedImageUrls = data.image;
          // this.selectedImageUrls = data.image.map((imageObj: any) => imageObj.imageUrl);
        },
        (error) => {
          console.error(error);
        }
      );

    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const imagesControl = this.productForm.get('image') as FormArray;

      if (this.selectedImages.length === 0) {
        imagesControl.clear();
      } else {
        for (const image of this.selectedImages) {
          if (image !== null) {
            imagesControl.push(this.formBuilder.control(image));
          }
        }
      }

      const productData = {
        ...this.product,
        ...this.productForm.value,
      };
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('category', productData.category);
      formData.append('price', productData.price);
      formData.append('rating', productData.rating);
      formData.append('availability', productData.availability);
      formData.append('description', productData.description);

      for (const image of this.selectedImages) {
        formData.append('image', image);
      }

      this.productService.updateProduct(formData, productData.id).subscribe(
        (response) => {
          this.productForm.reset();
          this.selectedImages = [];
          this.selectedImageUrls = [];
          this.router.navigate(["/admindashboard"])
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
    this.selectedImages = [];
    this.selectedImageUrls = [];
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

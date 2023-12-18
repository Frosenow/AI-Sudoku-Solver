
# AI Sudoku Solver

AI Sudoku Solver is a web application using image analysis algorithms and neural networks, to facilitate solving a logic puzzle like Sudoku. All the image analysis algorithms for extracting the Sudoku grid from a photo were implemented from scratch. 

**Deployed site:** [AI Sudoku Solver](https://sudoku-solver-7785.onrender.com/)

![Mockup of the site](https://github.com/Frosenow/Dictionary-Autocompletion-Using-Trie/assets/75395761/dfe061f6-0863-4ec5-8ad9-a2dee1480e5a)
## How it works?

**1. Grayscale:** </br>
What it does: Converts the input image from color to grayscale. </br>
Why it was done: Grayscale images simplify the processing by removing color information, making subsequent steps more straightforward and computationally efficient.

**2. BoxBlur:** </br>
What it does: Applies a box blur (or average blur) to the grayscale image. </br>
Why it was done: Blur helps to smooth out noise and small variations in pixel intensity, making subsequent image processing steps, like thresholding, more robust.

**3. Thresholding:** </br>
What it does: Converts the blurred image into a binary image by setting a threshold. Pixels below the threshold become black, and pixels above the threshold become white. </br>
Why it was done: Thresholding simplifies the image by emphasizing edges and important features, making it easier to detect objects and boundaries.

**4. Blob Detection:** </br>
What it does: Identifies and extracts connected regions or blobs in the binary image. </br>
Why it was done: Blob detection helps locate potential regions of interest, such as the Sudoku grid cells, by identifying connected sets of pixels.

**5. Finding Corner Points:** </br>
What it does: Identifies the corner points of the Sudoku grid. </br>
Why it was done: Corner points are crucial for later steps, especially for applying a homography transform. They help define the perspective and orientation of the grid in the image.

**6. Homography Transform:** </br>
What it does: Applies a homography transformation to rectify the perspective of the Sudoku grid. </br>
Why it was done: The homography transform is used to correct any distortions caused by the camera perspective, ensuring that the grid lines appear straight and parallel. This step is particularly important for accurately extracting the Sudoku grid.

Grayscale | Box Blur
:-------------------------:|:-------------------------:
 <img src="https://github.com/Frosenow/Dictionary-Autocompletion-Using-Trie/assets/75395761/d1048780-74d0-449a-807b-d3575ec7f06a" width="50%" heigth="50%" />  | <img src="https://github.com/Frosenow/Dictionary-Autocompletion-Using-Trie/assets/75395761/fc621641-7d57-43e6-9b2b-6d2914897529" width="50%" heigth="50%" />
Thresholding | Blob Detection
 <img src="https://github.com/Frosenow/Dictionary-Autocompletion-Using-Trie/assets/75395761/9aa8dd57-9ae0-412e-bcbf-ee64ecea5d6a" width="50%" heigth="50%" />  | <img src="https://github.com/Frosenow/Dictionary-Autocompletion-Using-Trie/assets/75395761/5525bb6a-a66b-4ce3-9e47-c59508ca4682" width="50%" heigth="50%" /> 
Corner Points Detection  | Homography Transform 
 <img src="https://github.com/Frosenow/Dictionary-Autocompletion-Using-Trie/assets/75395761/8bd3b547-a302-4329-aab3-36101bf545ac" width="50%" heigth="50%" />  |  <img src="https://github.com/Frosenow/Dictionary-Autocompletion-Using-Trie/assets/75395761/8540a316-294a-49fc-b9f7-ed81d3d23114" width="50%" heigth="50%" />
 

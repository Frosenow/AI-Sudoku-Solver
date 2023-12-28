
# AI Sudoku Solver

AI Sudoku Solver is a web application using image analysis algorithms and neural networks, to facilitate solving a logic puzzle like Sudoku. All the image analysis algorithms for extracting the Sudoku grid from a photo were implemented from scratch. 

**Deployed site:** [AI Sudoku Solver](https://sudoku-solver-7785.onrender.com/) 
(The first page loading may take a long while)

<div align="center">
<img align="center" src="https://github.com/Frosenow/Dictionary-Autocompletion-Using-Trie/assets/75395761/dfe061f6-0863-4ec5-8ad9-a2dee1480e5a" alt="Mockup of the site" />
</div>

## How it works?

**Tech used:** HTML, CSS, JavaScript, Node.js (Express.js), TensorFlow.js, TypeScript  

The application processes Sudoku logic puzzles sent by users using algorithms implemented from scratch, such as: 

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

The purpose of the implemented algorithms is to detect the Sudoku grid in the image, extract the digits, and draw the Sudoku grid lines. Once all the digits have been extracted, an OCR algorithm is used, employing neural networks to recognize the extracted digits. Finally, the "Pencil mark algorithm" was chosen for solving Sudoku, working by eliminating the possibility of digits in the empty fields of the board, leading to finding the final values for the individual boxes. The algorithm initially analyzes the Sudoku board to find the already existing values and then creates a list of potential values for the empty boxes, eliminating solution possibilities that are already present in the same row, column, or subquadrant. The elimination is repeated until it exhausts all possibilities, after which a final value is assigned to the blank field if only one potential value remains. The entire cycle is then repeated until all the empty fields are filled with final values.

<div align="center">
<img align="center" src="https://github.com/Frosenow/AI-Sudoku-Solver/assets/75395761/e1135884-18b9-4069-be69-a04a949c7d60" alt="Solved Sudoku Puzzle" />
</div>

# Getting Started 
### Prerequisites
To run this project, you need Node.js and npm installed on your system.

### Installing
* Clone or download the project repository to your local machine.
* Install the dependencies by running the following `npm install` in root folder which is `/app`
* To start the Node.js server, run the following command: `npm run dev`

### Features 

* Detecting sudoku grid and extracting numbers from photos uploaded by users 
* Ability to manually input the numbers, if an error occurred when detecting numbers 
* Algorithm to check the correctness of the detected Sudoku logic puzzle (shown below)

<div align="center">
<img align="center" src="https://github.com/Frosenow/AI-Sudoku-Solver/assets/75395761/66750332-c0b5-4331-82c2-b84c1973b0ad" alt="Error handling" />
</div>

## Lessons Learned:

* Implementing image detection and number recognition algorithms from scratch was a rewarding learning experience that deepened my understanding of computer vision and machine learning.  After extracting all the digits, there was a challenging task to recognize them. The first approach was to recognize the obtained digits using a model trained using convolutional networks on the MNIST dataset, acting as OCR (Optical Character Recognition). Unfortuitously, it turned out that, a collection of handwritten digits, such as MNIST, is not a good set for Sudoku digit recognition, because Sudoku mainly uses printed digits, which are not contained in a subset of the MNIST set. 
* The initial plan for solving extracted Sudokus involved using a CNN model trained on available datasets. However, the largest dataset found, with 9 million solved logic puzzles, seemed insufficient given the vast number of Sudoku combinations (about six trillion). Creating an effective dataset for such patterns would be impractical. Facing these challenges, an alternative solution was sought—solving Sudoku using genetic algorithms. This approach mimics biological evolution, employing concepts like population, individual, crossover, mutation, and adaptation evaluation to find optimal or satisfactory solutions. Unfortunately, the implemented genetic algorithm had a significant drawback—long solution times. Factors like searching a sizable solution space, a complex matching function, and the inefficiency of crossovers and mutations contributed to an average solving time of 30 minutes for real cases. This contradicted project assumptions and presentation capabilities. Consequently, the "Pencil mark algorithm" was chosen as a more viable solution for Sudoku, as described earlier.

## Examples:
Take a look at these couple examples that I have in my portfolio:

**LiftLogic.AI - Virtual Training Assistant:** https://github.com/Frosenow/AI-Training-Assistant

**Dictionary Autcompletion Using Trie Data Structure:** https://github.com/Frosenow/Dictionary-Autocompletion-Using-Trie

**Locatobia - Guide for busy tourists**: https://github.com/Frosenow/Locatobia
 

/*
   Jonas Kjeldmand Jensen
   April 2024

   Visualization of Neural Network and how wights affect it

*/

// Define a Neural Network class
class NeuralNetwork {
    constructor(structure) {
      // Store the structure of the network (number of nodes in each layer)
      this.structure = structure;
      // Calculate the number of layers
      this.nLayers = this.structure.length;
  
      // Initialize weights for connections between layers
      this.weights = new Array(this.nLayers - 1);
      for (let i = 0; i < this.weights.length; i++) {
        // Initialize each weight matrix with random values
        this.weights[i] = new Matrix(this.structure[i + 1], this.structure[i]);
        this.weights[i].randomize(-1, 1, "float");
      }
  
      // Initialize biases for each layer
      this.biases = new Array(this.nLayers - 1);
      for (let i = 0; i < this.biases.length; i++) {
        // Initialize each bias matrix with random values
        this.biases[i] = new Matrix(this.structure[i + 1], 1);
        this.biases[i].randomize(-1, 1, "float");
      }
  
      // Set the learning rate
      this.learningRate = 0.1;
    }
  
    // Feedforward function to compute the output of the network
    feedForward(inputArray, targetLayer) {
      // Get weights and biases for the target layer
      let weights = this.weights[targetLayer - 1];
      let biases = this.biases[targetLayer - 1];
  
      // Convert input array to a Matrix object
      let inputs = Matrix.fromArray(inputArray);
      // Compute the output of the layer
      let outputs = Matrix.dot(weights, inputs);
      // Add biases to the outputs
      outputs.add(biases);
  
      // Return the output as an array
      return outputs.toArray();
    }
  
    // Training function to update weights and biases using backpropagation
    train(inputArray, targetArray) {
      // Initialize variables to store intermediate results
      let input = inputArray;
      let outputs_unmapped = [];
      let outputs = [];
  
      // Array to store errors for each layer
      let errors = new Array(this.nLayers - 1);
  
      // Feedforward through all layers
      for (let i = 0; i < this.nLayers - 1; i++) {
        // Compute output of current layer
        outputs_unmapped.push(this.feedForward(input, i + 1));
        // Apply activation function to output
        outputs.push(Matrix.mapArray(outputs_unmapped[i], sigmoid));
        // Update input for next layer
        input = outputs[i];
      }
  
      // Convert arrays to Matrix objects
      for (let i = 0; i < outputs.length; i++) {
        outputs[i] = Matrix.fromArray(outputs[i]);
      }
      let targets = Matrix.fromArray(targetArray);
  
      // Calculate final errors
      errors[errors.length - 1] = Matrix.subtract(targets, outputs[outputs.length - 1]);
  
      // Variables for backpropagation
      let weights_trans;
      let output_trans;
      let gradients;
      let deltas;
  
      // Backpropagation to update weights and biases
      for (let i = this.nLayers - 2; i >= 0; i--) {
        // Calculate errors
        if (i < this.nLayers - 2) {
          weights_trans = Matrix.transpose(this.weights[i + 1]);
          errors[i] = Matrix.dot(weights_trans, errors[i + 1]);
        }
  
        // Calculate gradients
        gradients = Matrix.fromArray(Matrix.mapArray(outputs_unmapped[i], dSigmoid));
        gradients.multiply(errors[i]);
        gradients.multiply(this.learningRate);
  
        // Calculate deltas
        if (i > 0) {
          output_trans = Matrix.transpose(outputs[i - 1]);
        } else {
          output_trans = Matrix.transpose(Matrix.fromArray(inputArray));
        }
        deltas = Matrix.dot(gradients, output_trans);
  
        // Adjust weights by deltas
        this.weights[i].add(deltas);
  
        // Adjust biases by gradients
        this.biases[i].add(gradients);
      }
    }
  
    // Function to make predictions
    guess(inputArray) {
      let input = inputArray;
      let output_unmapped;
      let output;
  
      // Feedforward through all layers
      for (let i = 0; i < this.nLayers - 1; i++) {
        // Compute output of current layer
        output_unmapped = this.feedForward(input, i + 1);
        // Apply activation function to output
        output = Matrix.mapArray(output_unmapped, sigmoid);
        // Update input for next layer
        input = output;
      }
  
      return output;
    }
  
    // Utility function to round weights with a given factor
    roundWeights(factor) {
      for (let i = 0; i < this.weights.length; i++) {
        for (let j = 0; j < this.weights[i].data.length; j++) {
          for (let k = 0; k < this.weights[i].data[j].length; k++) {
            this.weights[i].data[j][k] = round(this.weights[i].data[j][k] * factor) / factor;
          }
        }
      }
      print("Weights optimized (factor " + factor + ")");
    }
  
    // Utility function to round biases with a given factor
    roundBiases(factor) {
      for (let i = 0; i < this.biases.length; i++) {
        for (let j = 0; j < this.biases[i].data.length; j++) {
          for (let k = 0; k < this.biases[i].data[j].length; k++) {
            this.biases[i].data[j][k] = round(this.biases[i].data[j][k] * factor) / factor;
          }
        }
      }
      print("Biases optimized (factor " + factor + ")");
    }
  
    // Utility function to print weights
    printWeights() {
      print("Printing weights:");
      let str = "[";
      for (let i = 0; i < this.weights.length; i++) {
        for (let j = 0; j < this.weights[i].data.length; j++) {
          str += "[";
          str += this.weights[i].data[j];
          j < this.weights[i].data.length - 1 ? str += "], " : str += "]";
        }
        i < this.weights.length - 1 ? str += ", " : str += "";
      }
      str += "]";
      print(str);
    }
  
    // Utility function to print biases
    printBiases() {
      print("Printing biases:");
      let str = "[";
      for (let i = 0; i < this.biases.length; i++) {
        for (let j = 0; j < this.biases[i].data.length; j++) {
          str += this.biases[i].data[j];
          j < this.biases[i].data.length - 1 ? str += ", " : str += "";
        }
        i < this.biases.length - 1 ? str += ", " : str += "";
      }
      str += "]";
      print(str);
    }
  
    // Utility function to overwrite weights
    overwriteWeights(weights) {
      print("Overwriting weights");
      let ind = 0;
      for (let i = 0; i < this.weights.length; i++) {
        for (let j = 0; j < this.weights[i].data.length; j++) {
          for (let k = 0; k < this.weights[i].data[j].length; k++) {
            this.weights[i].data[j][k] = weights[ind][k];
          }
          ind++;
        }
      }
    }
  
    // Utility function to overwrite biases
    overwriteBiases(biases) {
      print("Overwriting biases");
      let ind = 0;
      for (let i = 0; i < this.biases.length; i++) {
        for (let j = 0; j < this.biases[i].data.length; j++) {
          this.biases[i].data[j][0] = biases[ind];
          ind++;
        }
      }
    }
  }
  
  // Define a class for visualizing the neural network
  class NNVisualization {
    constructor(nn, x, y, w, h) {
      this.nn = nn;
      this.x = x;
      this.y = y;
      this.h = h;
      this.w = w;
  
      // Find the maximum number of nodes in any layer
      let maxNNodes = findMax(nn.structure);
      // Calculate the horizontal and vertical distances between layers and nodes
      let dXLayer = w / (nn.structure.length - 1);
      let dYNode = h / (maxNNodes - 1);
      let offsetY;
  
      // Array to store nodes
      this.nodes = [];
  
      // Populate nodes array
      for (let i = 0; i < this.nn.nLayers; i++) {
        this.nodes[i] = [];
        offsetY = (h - (this.nn.structure[i] - 1) * dYNode) / 2;
  
        for (let j = 0; j < this.nn.structure[i]; j++) {
          this.nodes[i].push(new Node(x + i * dXLayer, y + offsetY + j * dYNode));
        }
      }
  
      // Array to store connections between nodes
      this.connections = [];
      for (let i = 0; i < this.nn.nLayers - 1; i++) {
        this.connections[i] = new Matrix(this.nn.structure[i + 1], this.nn.structure[i]);
  
        for (let j = 0; j < this.nn.structure[i + 1]; j++) {
          for (let k = 0; k < this.nn.structure[i]; k++) {
            this.connections[i].data[j][k] = new Connection(this.nodes[i][k], this.nodes[i + 1][j]);
          }
        }
      }
    }
  
    // Function to display the neural network
    display() {
      // Display connections
      let weight, clr, strength;
      for (let i = 0; i < this.connections.length; i++) {
        for (let j = 0; j < nn.structure[i + 1]; j++) {
          for (let k = 0; k < nn.structure[i]; k++) {
            weight = this.nn.weights[i].data[j][k];
            strength = map(abs(weight), 0, 1, 0, 255);
            if (weight < 0) {
              clr = color(0, 0, 255, strength);
            } else {
              clr = color(255, 0, 0, strength);
            }
            this.connections[i].data[j][k].display(clr);
          }
        }
      }
  
      // Display nodes
      for (let i = 0; i < nn.nLayers; i++) {
        for (let j = 0; j < nn.structure[i]; j++) {
          this.nodes[i][j].display();
        }
      }
    }
  }
  
  // Define a class for a single node in the visualization
  class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.d = 6; // Diameter of the node
    }
  
    // Function to display the node
    display() {
      fill(255); // Node color
      stroke(0); // Node border color
      strokeWeight(1); // Border thickness
      circle(this.x, this.y, this.d); // Draw the node
    }
  }
  
  // Define a class for a connection between two nodes
  class Connection {
    constructor(nodeA, nodeB) {
      this.x1 = nodeA.x;
      this.x2 = nodeB.x;
      this.y1 = nodeA.y;
      this.y2 = nodeB.y;
    }
  
    // Function to display the connection
    display(clr) {
      stroke(clr); // Connection color
      strokeWeight(3); // Connection thickness
      line(this.x1, this.y1, this.x2, this.y2); // Draw the connection
    }
  }
  
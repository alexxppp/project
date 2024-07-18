# XOR Example
import numpy as np
from network import NeuralNetwork
from fc_layer import FullyConnectedLayer
from activation_layer import ActivationLayer
from activations import tanh, tanh_derivative
from losses import mean_squared_error, mean_squared_error_derivative

# Training data for XOR problem
x_train = np.array([[[0, 0]], [[0, 1]], [[1, 0]], [[1, 1]]])
y_train = np.array([[[0]], [[1]], [[1]], [[0]]])

# Define the neural network
network = NeuralNetwork()
network.add_layer(FullyConnectedLayer(2, 3))
network.add_layer(ActivationLayer(tanh, tanh_derivative))
network.add_layer(FullyConnectedLayer(3, 1))
network.add_layer(ActivationLayer(tanh, tanh_derivative))

# Train the network
network.set_loss_function(mean_squared_error, mean_squared_error_derivative)
network.train(x_train, y_train, epochs=1000, learning_rate=0.1)

# Test the network
predictions = network.predict(x_train)
print(predictions)

package StockPredictor;

import org.deeplearning4j.nn.api.OptimizationAlgorithm;
import org.deeplearning4j.nn.conf.MultiLayerConfiguration;
import org.deeplearning4j.nn.conf.NeuralNetConfiguration;
import org.deeplearning4j.nn.conf.layers.OutputLayer;
import org.deeplearning4j.nn.conf.layers.DenseLayer;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;
import org.deeplearning4j.nn.weights.WeightInit;
import org.nd4j.linalg.activations.Activation;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.dataset.DataSet;
import org.nd4j.linalg.learning.config.Adam;
import org.nd4j.linalg.lossfunctions.LossFunctions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Predictor {

    private static final Logger logger = LoggerFactory.getLogger(Predictor.class);

    //MADE WITH HELP OF AI, ESPECIALLY FOR THE DEEPLEARNING4J SYNTAX AND CONFIGURATION OF LAYERS
    public MultiLayerNetwork buildModel(int inputSize, int outputSize) {
        MultiLayerConfiguration conf = new NeuralNetConfiguration.Builder()
                .seed(123)
                .optimizationAlgo(OptimizationAlgorithm.STOCHASTIC_GRADIENT_DESCENT)
                .updater(new Adam(0.001))
                .list()
                .layer(new DenseLayer.Builder().nIn(inputSize).nOut(50)
                        .activation(Activation.RELU)
                        .weightInit(WeightInit.XAVIER)
                        .build())
                .layer(new OutputLayer.Builder(LossFunctions.LossFunction.MSE)
                        .activation(Activation.IDENTITY)
                        .nIn(50).nOut(outputSize).build())
                .build();

        MultiLayerNetwork model = new MultiLayerNetwork(conf);
        model.init();
        return model;
    }

    public void trainModel(MultiLayerNetwork model, DataSet trainingData, int epochs) {
        for (int i = 0; i < epochs; i++) {
            model.fit(trainingData);
            double error = model.score();
            logger.info("Epoch {}: Error = {}", i, error);
        }
    }

    public INDArray predict(MultiLayerNetwork model, INDArray input) {
        return model.output(input);
    }
}
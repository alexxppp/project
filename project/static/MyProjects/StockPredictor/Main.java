 
package StockPredictor;

import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;
import org.nd4j.linalg.dataset.DataSet;
import org.nd4j.linalg.api.ndarray.INDArray;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Scanner;
import org.nd4j.linalg.dataset.SplitTestAndTrain;

public class Main {
    public static void main(String[] args) {
        
        System.out.println("WARNING! This is simply a prediction and it is not meant to be taken as true information.");
        System.out.println("READ! After typing a valid symbol, the software will go through a brief phase of training "
                + "based on the history of stock prices of the given symbol. When trained, it will output the prediction "
                + "for the stock price of the next 20 days from the day of execution of the given symbol");
        Scanner sc = new Scanner(System.in);
        System.out.print("Stock symbol: ");
        String input = sc.next();
        
        try {
            
            // Fetch historical stock data
            Fetcher fetcher = new Fetcher();
            List<Double> history = fetcher.fetchHistoricalData(input);
            double latest_price = history.get(0);

            // Preprocess the datap
            Processor preprocessor = new Processor();
            DataSet dataSet = preprocessor.preprocessData(history);

            // Split data into training and test sets
            SplitTestAndTrain split = dataSet.splitTestAndTrain(0.8);
            DataSet trainingData = split.getTrain();
            DataSet testData = split.getTest();

            // Build and train the model
            Predictor predictor = new Predictor();
            MultiLayerNetwork model = predictor.buildModel(1, 1);
            predictor.trainModel(model, trainingData, 1000);

            // Make predictions
            INDArray predictions = predictor.predict(model, testData.getFeatures());
            double[] denormalizedPredictions = preprocessor.denormalizePredictions(predictions);
            LocalDate date = LocalDate.now();
            String format;
            System.out.println("Predictions of the stock price of '" + input + "' for the next 20 days: ");
            format = String.format("%.2f", latest_price);
            System.out.println("Today (latest close): " + format);
            for (int i = 0, length = denormalizedPredictions.length; i < length; i++) {
                format = String.format("%.2f", denormalizedPredictions[i]);
                System.out.println("Day " + date.plusDays(i + 1) + " : " + format + " €");
            }

        } catch (IOException e) {
            System.out.println("Symbol not found or invalid. Error: " + e.getMessage());
        }
    }
}
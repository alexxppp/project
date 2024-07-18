
package StockPredictor;

import org.nd4j.linalg.dataset.DataSet;
import org.nd4j.linalg.factory.Nd4j;
import java.util.List;
import org.nd4j.linalg.api.ndarray.INDArray;

public class Processor {

    private double maxPrice;
    private double minPrice;

    public DataSet preprocessData(List<Double> prices) {
        int size = prices.size();
        maxPrice = prices.stream().max(Double::compare).orElse(1.0);
        minPrice = prices.stream().min(Double::compare).orElse(0.0);

        double[][] input = new double[size - 1][1];
        double[][] output = new double[size - 1][1];

        for (int i = 0; i < size - 1; i++) {
            input[i][0] = (prices.get(i) - minPrice) / (maxPrice - minPrice);
            output[i][0] = (prices.get(i + 1) - minPrice) / (maxPrice - minPrice);
        }

        return new DataSet(Nd4j.create(input), Nd4j.create(output));
    }

    public double[] denormalizePredictions(INDArray predictions) {
        double[] denormalized = new double[(int)predictions.length()];
        for (int i = 0; i < predictions.length(); i++) {
            denormalized[i] = predictions.getDouble(i) * (maxPrice - minPrice) + minPrice;
        }
        return denormalized;
    }
}
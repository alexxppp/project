package StockPredictor;
        
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Fetcher {

    private static final String API_KEY = "40IJ30O86CF5QRGH";
    private static final String BASE_URL = "https://www.alphavantage.co/query?";

    private final OkHttpClient client;

    public Fetcher() {
        this.client = new OkHttpClient();
    }

    //MADE WITH THE HELP OF AI , ESPECIALLY FOR THE FETCHING SYNTAX
    public List<Double> fetchHistoricalData(String symbol) throws IOException {
        String url = BASE_URL + "function=TIME_SERIES_DAILY&symbol=" + symbol + "&apikey=" + API_KEY;

        Request request = new Request.Builder()
                .url(url)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            String jsonData = response.body().string();
            JSONObject jsonObject = new JSONObject(jsonData).getJSONObject("Time Series (Daily)");
            if (jsonObject == null) {
                throw new IOException("Invalid response from API.");
            }
            List<Double> prices = new ArrayList<>();

            for (String date : jsonObject.keySet()) {
                double closePrice = jsonObject.getJSONObject(date).getDouble("4. close");
                prices.add(closePrice);
            }

            return prices;
        }
    }
}
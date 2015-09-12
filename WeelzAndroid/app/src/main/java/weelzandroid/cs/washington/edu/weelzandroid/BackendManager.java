package weelzandroid.cs.washington.edu.weelzandroid;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

/**
 * Created by Joseph on 9/12/15.
 */
public class BackendManager
{
    /**
     * endpoints to append to db
     */
    private final String INSERT_PIN_ENDPOINT = "/insertPin";
    private final String GET_PINS_ENDPOINT = "/getPins";
    private final String UPDATE_VOTE_ENDPOINT = "/vote";

    /**
     * DB Constants
     */
    private final String PORT = "47581";
    private final String DB = "weelz";
    private final String USER = "admin";
    private final String PASSWORD = "password";
    private final String MONGO_DB_URL = "mongodb://"
            + USER
            + ":"
            + PASSWORD
            + "@ds047581.mongolab.com";
    private final String NODE_ENDPOINT = ""; // TODO: get this value from Akshay

    private URL url;
    private String response = "";

    /**
     * Constructor
     */
    public BackendManager()
    {
    }

    /**
     * Insert function that calls the insertPin endpoint
     * @param lat lat coordinate
     * @param lng long coordinate
     * @param message annotation
     * @param type of hazard
     * @return boolean of success
     */
    public boolean insertPin(double lat, double lng, String message, int type){
        try {
            String insertPinUrlParams = "";
            insertPinUrlParams += "?"
                    + "lng=" + lng
                    + "&lat=" + lat
                    + "&message=" + message
                    + "&type=" + type;

            url = new URL(NODE_ENDPOINT + INSERT_PIN_ENDPOINT + insertPinUrlParams);

            // connect to heroku and reference endpoints
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(15000);
            conn.setConnectTimeout(15000);
            conn.setRequestMethod("GET");
            conn.setDoInput(true);
            conn.setDoOutput(true);

//            OutputStream os = conn.getOutputStream();
//            BufferedWriter writer = new BufferedWriter(
//                    new OutputStreamWriter(os, "UTF-8"));
//            writer.write(getPostData(postDataParams));
//
//            writer.flush();
//            writer.close();
//            os.close();
//            int responseCode=conn.getResponseCode();
//
//            if (responseCode == HttpsURLConnection.HTTP_OK) {
//                String line;
//                BufferedReader br=new BufferedReader(new InputStreamReader(conn.getInputStream()));
//                while ((line=br.readLine()) != null) {
//                    response+=line;
//                }
//            }
//            else {
//                response="";
//            }

            return true;
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}

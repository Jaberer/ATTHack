package weelzandroid.cs.washington.edu.weelzandroid;

import android.app.Activity;
import android.graphics.Color;
import android.location.Location;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.Gallery;
import android.widget.ImageButton;
import android.widget.LinearLayout;

import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONObject;

public class MapsActivity extends FragmentActivity implements
        GoogleMap.OnMapClickListener, GoogleMap.OnMapLongClickListener {

    /**
     * Might be null if Google Play services APK is not available.
     * Main map object
     */
    private GoogleMap mMap;

    /**
     * Global field of location TO BE FILLED
     */
    private Location currentLocation;

    /**
     * Denotes progress of marker being dropped
     */
    private boolean markerDropped;

    /**
     * Main backend handler
     */
    private BackendManager mBackendManager;

    /**
     * JSON to hold our pins
     */
    private Marker[] pins;



    public static final float[] COLORS = {BitmapDescriptorFactory.HUE_RED,
                                          BitmapDescriptorFactory.HUE_ORANGE,
                                          BitmapDescriptorFactory.HUE_YELLOW};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps); // goes to activity maps
        // default generated code
        setUpMapIfNeeded();

        // Centers map on your location upon set up and sets currentLocation
        mMap.setOnMyLocationChangeListener(new GoogleMap.OnMyLocationChangeListener() {
            @Override
            public void onMyLocationChange(Location location) {
                CameraUpdate center = CameraUpdateFactory.newLatLng(new LatLng(location.getLatitude(),
                        location.getLongitude()));
                CameraUpdate zoom = CameraUpdateFactory.zoomTo(11); // zoom level
                mMap.moveCamera(center);
                mMap.animateCamera(zoom);

                // set location
                currentLocation = location;

                // get all pins on server and display on map
                populateArrayOfMarkers();

                // stop looking for location
                mMap.setOnMyLocationChangeListener(null); // we should delete
            }
        });
        // TODO: make working
        //hideTextOnLost();

        // click listener on report hazard button
        addListenerOnButton();
        selectedPin();


        // begin handling backend
        mBackendManager = new BackendManager();

        /*Hub hub = Hub.getInstance();
        if (!hub.init(this)) {
            Log.e(TAG, "Could not initialize the Hub.");
            finish();
            return;
        }*/
    }

    /**
     * Gets all pins with BackendManager
     * Then Creates an array of Markers
     * from the JSON Array
     */
    public void populateArrayOfMarkers()
    {
        JSONObject pins = mBackendManager.getPins();
        
    }



    /**
     * Add Click listener for report hazard button
     * Inserts Pin at a hazard zone
     */
    public void addListenerOnButton() {
        // button to push hazard
        ImageButton commitHazardBtn = (ImageButton) findViewById(R.id.commit);

        commitHazardBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View arg0) {
                if (!markerDropped) {
                    mMap.addMarker(new MarkerOptions()
                        .position(new LatLng(currentLocation.getLatitude(), currentLocation.getLongitude()))
                        .title("Current Location")
                        .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED)));

                    // handle inserting pin to server
                    // TODO: MAKE MARKER OBJECT AND REFERENCE TITLE AND TYPE
                    mBackendManager.insertPin(currentLocation.getLatitude(),
                            currentLocation.getLongitude(), "Current Location", 2);
                }
            }

        });

        // button to add Hazard
        //ImageButton addHazard = (ImageButton) findViewById(R.id.addHazard);
//        addHazard.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View arg0) {
//                Toast.makeText(MapsActivity.this,
//                        "ImageButton is clicked!", Toast.LENGTH_SHORT).show();
//                mMap.addMarker(new MarkerOptions()
//                        .position(new LatLng(currentLocation.getLatitude(), currentLocation.getLongitude()))
//                        .title("Current Location")
//                        .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED)));
//            }
//        });

    }

    @Override
    protected void onResume() {
        super.onResume();
        setUpMapIfNeeded();
    }

    /**
     * Sets up the map if it is possible to do so (i.e., the Google Play services APK is correctly
     * installed) and the map has not already been instantiated.. This will ensure that we only ever
     * call {@link #setUpMap()} once when {@link #mMap} is not null.
     * <p/>
     * If it isn't installed {@link SupportMapFragment} (and
     * {@link com.google.android.gms.maps.MapView MapView}) will show a prompt for the user to
     * install/update the Google Play services APK on their device.
     * <p/>
     * A user can return to this FragmentActivity after following the prompt and correctly
     * installing/updating/enabling the Google Play services. Since the FragmentActivity may not
     * have been completely destroyed during this process (it is likely that it would only be
     * stopped or paused), {@link #onCreate(Bundle)} may not be called again so we should call this
     * method in {@link #onResume()} to guarantee that it will be called.
     */
    private void setUpMapIfNeeded() {
        // Do a null check to confirm that we have not already instantiated the map.
        if (mMap == null) {
            // Try to obtain the map from the SupportMapFragment.
            mMap = ((SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map))
                    .getMap();
            // Check if we were successful in obtaining the map.
            if (mMap != null) {
                setUpMap();
            }
        }
    }

    /**
     * This is where we can add markers or lines, add listeners or move the camera. In this case, we
     * just add a marker near Africa.
     * <p/>
     * This should only be called once and when we are sure that {@link #mMap} is not null.
     */
    private void setUpMap() {
        mMap.setMyLocationEnabled(true);

        // Overridden abstract functions for clicking on map
        mMap.setOnMapClickListener(this);
        mMap.setOnMapLongClickListener(this);

    }


    @Override
    /**
     * Clears Map and Drops marker on location of long hold
     */
    public void onMapLongClick(LatLng point) {
        mMap.clear();
        mMap.addMarker(new MarkerOptions()
                .position(point)
                .title("You are here")
                .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED)));
        markerDropped = true;

        // TODO: MAKE MARKER OBJECT AND REFERENCE TITLE AND TYPE
        mBackendManager.insertPin(currentLocation.getLatitude(),
            currentLocation.getLongitude(), "You are here", 1);
    }


    @Override
    /**
     * Clears map of markers
     */
    public void onMapClick(LatLng latLng) {
        mMap.clear();
        markerDropped = false;
    }

    /**
     * Hides keyboard - doesn't work
     * @param view
     */
    public void hideKeyboard(View view) {
        InputMethodManager inputMethodManager = (InputMethodManager) getSystemService(Activity.INPUT_METHOD_SERVICE);
        inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }

    /**
     * Doesn't work
     */
    private void hideTextOnLost() {
        /*findViewById(R.id.edit_reason).setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (!hasFocus) {
                    hideKeyboard(v);
                }
            }
        });*/
    }

    /**
     * Displays information on tapped marker
     */
    private void selectedPin() {
        FrameLayout frame = (FrameLayout)findViewById(R.id.framelayout);
        //Parent holder
        LinearLayout parent = new LinearLayout(this);

        parent.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        parent.setOrientation(LinearLayout.VERTICAL);



        EditText et=new EditText(this);
        et.setEnabled(false);
        et.setText("FUCK all of you");
        et.setBackgroundColor(Color.parseColor("#ffffff"));
        et.setLayoutParams(new Gallery.LayoutParams(Gallery.LayoutParams.FILL_PARENT, Gallery.LayoutParams.WRAP_CONTENT));

        ImageButton upVote = new ImageButton(this);
        upVote.setImageResource(R.drawable.up_round);

        parent.addView(et);
        parent.addView(upVote);


        frame.addView(parent);

    }
}

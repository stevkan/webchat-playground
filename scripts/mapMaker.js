const mapMaker = (function () {
  'use strict';
  
  const generateMap = async (store, name, value) => {
    // var map, defaultOptions;
    await navigator.geolocation.getCurrentPosition( async (position) => {
      const { latitude, longitude } = position.coords;

      const map = new atlas.Map('myMap', {
        center: [longitude, latitude],
        zoom: 13,
        language: 'en-US',
        style: 'grayscale_dark',
        renderWorldCopies: true,
        showBuildingModels: true,
        showFeedbackLink: false,
        showLogo: false,
        showTileBoundaries: false,
        light: {
          anchor: 'map',
          color: '#FFFFFF',
          intensity: 0.5,
          position: [1.15, 210, 30],
        },
        authOptions: {
          authType: 'subscriptionKey',
          subscriptionKey: 'wAYnEoEVv9IUIVaqIl-8GbIpn2WPFPD4vGiYCk-pre0',
        },
      });

      map.events.add( 'ready', function () {

        /*Create a data source and add it to the map*/
        var dataSource = new atlas.source.DataSource();
        map.sources.add( dataSource );
        var point = new atlas.Shape( new atlas.data.Point( [ longitude, latitude ] ) );
        //Add the symbol to the data source.
        dataSource.add( [ point ] );

        /* Gets co-ordinates of clicked location*/
        map.events.add( 'click', function ( e ) {
          /* Update the position of the point feature to where the user clicked on the map. */
          point.setCoordinates( e.position );
        } );

        //Create a symbol layer using the data source and add it to the map
        map.layers.add( new atlas.layer.SymbolLayer( dataSource, null ) );
        
        map.controls.add( new atlas.control.StyleControl( {
          mapStyles: [ 'road', 'night', 'grayscale_dark', 'grayscale_light' ],
          layout: 'list',
          style: 'dark'
        } ), {
          position: 'top-right'
        } );

        map.controls.add( new atlas.control.ZoomControl(), {
          position: 'bottom-right'
        } );

        map.controls.add( new atlas.control.PitchControl(), {
          position: 'top-right'
        } );

        map.controls.add( new atlas.control.CompassControl(), {
          position: 'bottom-left'
        } );
      } );


      await store.dispatch( {
        type: 'WEB_CHAT/SEND_EVENT',
        payload: {
          name: `${ name }`,
          value: {
            name: `${ value }`,
            location: { latitude: latitude, longitude: longitude }
          }
        }
      } );
    } );
  }

  return generateMap;
})();


const route = {
    SIMPLE_SCAN : 'Simple Scan',
    ENABLE_RADAR : 'Enable Radar',
    DISABLE_RADAR : 'Disable Radar',
    START : 'start'
}


const constants = {
    POKEVISION_URL : 'https://pokevision.com/map/data/LAT/LNG',
    SKIPLAGGED_URL : 'https://skiplagged.com/api/pokemon.php?bounds=51.505289,-0.134602,51.517161,-0.104754',
    MY_HOUSE_LAT   : '51.51042851560268',
    MY_HOUSE_LNG   : '-0.12191176414489746',
    SCAN_FREQUENCY : 2*60*1000,
    route          : route
}

module.exports = constants;



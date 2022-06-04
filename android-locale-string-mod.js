const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function (config) {
    return withAppBuildGradle(config, async (props) => {
        props.modResults.contents = props.modResults.contents.replace('org.webkit:android-jsc:+', 'org.webkit:android-jsc-intl:+');

        return props;
    })
}
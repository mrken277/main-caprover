import fs = require('fs-extra')
import path = require('path')
import EnvVars = require('./EnvVars')

const CAPTAIN_BASE_DIRECTORY = '/captain'
const CAPTAIN_DATA_DIRECTORY = CAPTAIN_BASE_DIRECTORY + '/data' // data that sits here can be backed up
const CAPTAIN_ROOT_DIRECTORY_TEMP = CAPTAIN_BASE_DIRECTORY + '/temp'
const CAPTAIN_ROOT_DIRECTORY_GENERATED = CAPTAIN_BASE_DIRECTORY + '/generated'

const CONSTANT_FILE_OVERRIDE_BUILD = path.join(__dirname, '../../config-override.json')
const CONSTANT_FILE_OVERRIDE_USER = CAPTAIN_DATA_DIRECTORY + '/config-override.json'

const configs = {
    publishedNameOnDockerHub: 'caprover/caprover',

    version: '0.0.1',

    defaultMaxLogSize: '512m',

    buildLogSize: 50,

    preCheckForWildCard: true,

    registrySubDomainPort: 996,

    netDataImageName: 'titpetric/netdata:1.8',

    registryImageName: 'registry:2',

    appPlaceholderImageName: 'caprover/caprover-placeholder-app:latest',

    nginxImageName: 'nginx:1',

    defaultEmail: 'runner@caprover.com',
}

let data = {
    configs: configs, // values that can be overridden

    // ******************** Global Constants *********************

    apiVersion: 'v2',

    isDebug: EnvVars.CAPTAIN_IS_DEBUG,

    captainServiceExposedPort: 3000,

    rootNameSpace: 'captain',

    // *********************** Disk Paths ************************

    dockerSocketPath: '/var/run/docker.sock',

    sourcePathInContainer: '/usr/src/app',

    nginxStaticRootDir: '/usr/share/nginx',

    captainStaticFilesDir: CAPTAIN_ROOT_DIRECTORY_GENERATED + '/static',

    nginxSharedPathOnNginx: '/nginx-shared',

    nginxDefaultHtmlDir: '/default',

    letsEncryptEtcPathOnNginx: '/letencrypt/etc',

    nginxDomainSpecificHtmlDir: '/domains',

    captainConfirmationPath: '/.well-known/captain-identifier',

    captainBaseDirectory: CAPTAIN_BASE_DIRECTORY,

    captainRootDirectoryTemp: CAPTAIN_ROOT_DIRECTORY_TEMP,

    captainRawSourceDirectoryBase: CAPTAIN_ROOT_DIRECTORY_TEMP + '/image_raw',

    captainRootDirectoryGenerated: CAPTAIN_ROOT_DIRECTORY_GENERATED,

    registryAuthPathOnHost: CAPTAIN_ROOT_DIRECTORY_GENERATED + '/registry-auth', // this is a file

    baseNginxConfigPath: CAPTAIN_ROOT_DIRECTORY_GENERATED + '/nginx/nginx.conf', // this is a file

    rootNginxConfigPath:
        CAPTAIN_ROOT_DIRECTORY_GENERATED + '/nginx/conf.d/captain-root',

    perAppNginxConfigPathBase:
        CAPTAIN_ROOT_DIRECTORY_GENERATED + '/nginx/conf.d',

    captainDataDirectory: CAPTAIN_DATA_DIRECTORY,

    letsEncryptLibPath: CAPTAIN_DATA_DIRECTORY + '/letencrypt/lib',

    letsEncryptEtcPath: CAPTAIN_DATA_DIRECTORY + '/letencrypt/etc',

    registryPathOnHost: CAPTAIN_DATA_DIRECTORY + '/registry',

    nginxSharedPathOnHost: CAPTAIN_DATA_DIRECTORY + '/nginx-shared',

    debugSourceDirectory: '', // Only used in debug mode

    // ********************* Local Docker Constants  ************************

    certbotImageName: 'caprover/certbot-sleeping:v0.29.1',

    captainSaltSecretKey: 'captain-salt',

    nginxServiceName: 'captain-nginx',

    captainServiceName: 'captain-captain',

    certbotServiceName: 'captain-certbot',

    netDataContainerName: 'captain-netdata-container',

    registryServiceName: 'captain-registry',

    captainNetworkName: 'captain-overlay-network',

    captainRegistryUsername: 'captain',

    // ********************* HTTP Related Constants  ************************

    nginxPortNumber: 80,

    netDataRelativePath: '/net-data-monitor',

    healthCheckEndPoint: '/checkhealth',

    captainSubDomain: 'captain',

    registrySubDomain: 'registry',

    headerCookieAuth: 'captainCookieAuth',

    headerAuth: 'x-captain-auth',

    headerNamespace: 'x-namespace',
}

function overrideFromFile(fileName: string) {
    let overridingValuesConfigs = fs.readJsonSync(fileName, {
        throws: false,
    })

    if (!!overridingValuesConfigs) {
        for (let prop in overridingValuesConfigs) {
            if (!overridingValuesConfigs.hasOwnProperty(prop)) {
                continue
            }

            console.log('Overriding ' + prop + ' from ' + fileName)
            // @ts-ignore
            configs[prop] = overridingValuesConfigs[prop]
        }
    }
}

overrideFromFile(CONSTANT_FILE_OVERRIDE_BUILD)

overrideFromFile(CONSTANT_FILE_OVERRIDE_USER)

if (data.isDebug) {
    let devDirectoryOnLocalMachine = fs
        .readFileSync(__dirname + '/../../currentdirectory')
        .toString()
        .trim()

    if (!devDirectoryOnLocalMachine) {
        throw new Error(
            'For development purposes, you need to assign your local directory here'
        )
    }

    data.debugSourceDirectory = devDirectoryOnLocalMachine
    data.configs.publishedNameOnDockerHub = 'captain-debug'
    data.nginxPortNumber = 80
}

export = data
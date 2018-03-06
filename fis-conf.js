/***
 *  == 编译
 *  fis3 release production -d output
 *  确保release的文件在项目路径的output文件夹下
 *
 *  == 上传到服务器（依赖编译生成的路径 output）
 * fis3 release deploy
 */

// 服务器发布路径，如 /data/web/sites/gcld
var SERVER_FILE_PATH = 'E:/home/work/main'
// 接收端 url
var RECEIVER = 'http://192.168.60.84:8999/receiver';
// 排除某些文件
fis.set('project.ignore', ['**.bak', '**.map', '**.txt', 'test/**', 'tool/**', 'doc/**', 'fis-conf.js', '**/bower.json', 'package.json']);

fis
    .media('dev')
    // 加 md5
    .match('*.{js,css,png}', {
        useHash: true
    })
    .match('::package', {
        spriter: fis.plugin('csssprites')
    })
    .match('*.css', {
        useSprite: true
    })
    .match('*.js', {
        optimizer: fis.plugin('uglify-js')
    })
    .match('*.css', {
        optimizer: fis.plugin('clean-css')
    });

fis
    .media('production')
    .set('project.ignore', ['components/*/src/**', '*.bak', '*.map', '*.txt', '*.md', 'test/**', 'tool/**', 'doc/**', 'fis-conf.js', '*.json'])
    .set('project.md5Connector ', '_')
    // 依赖类库 仅作文件移动，不加MD5码及压缩
    .match('components/**.{js,css}', {
        release: '/static/$0',
        url: '$0'
    })
    // 静态CSS JS资源放在static目录下
    .match('src/(**.css)', {
        release: '/static/$1',
        url: '/$1'
    })
    .match('src/(**.js)', {
        release: '/static/$1',
        url: '/$1'
    })
    // 静态图片资源放在static目录下
    .match('src/(**.png)', {
        release: '/static/$1',
        url: '/$1'
    })
    .match('src/(**.ico)', {
        release: '/static/$1',
        url: '/$1'
    })
    .match('src/(**.svg)', {
        release: '/static/$1',
        url: '/$1'
    })
    .match('src/(**.jpg)', {
        release: '/static/$1',
        url: '/$1'
    })
    .match('src/(**.gif)', {
        release: '/static/$1',
        url: '/$1'
    })
    .match('src/(**.swf)', {
        release: '/static/$1',
        url: '/$1'
    })
    .match('src/(**.mp3)', {
        release: '/static/$1',
        url: '/$1'
    })
    .match('src/(**.jpeg)', {
        release: '/static/$1',
        url: '/$1'
    })
    // HTML 文件按照原目录copy
    .match('src/(**.html)', {
        release: '/$1',
        url: '$1'
    })
    .match('src/code/i18n/(**.json)', {
        release: 'code/i18n/$1'
    })
    // CSS JS增加指纹
    .match('src/**.{js,css}', {
        useHash: true
    })
    // 图片增加指纹
    .match('::image', {
        useHash: true
    })
    // 压缩JS
    .match('src/**.js', {
        optimizer: fis.plugin('uglify-js')
    })
    // 编译LESS TO CSS
    .match('src/**.less', {
        parser: fis.plugin('less'),
        rExt: '.css'
    })
    //编译SASS TO CSS
    .match('src/*.sass', {
        rExt: '.css',
        parser: fis.plugin('node-sass'),
        // options...
    })
    // 压缩CSS
    .match('src/**.{css,less}', {
        optimizer: fis.plugin('clean-css')
    })
    // 替换静态资源CDN域名
    .match('**.{js,css}', {
        domain: 'http://images-sg-cdn.pocketgamesol.com/cos-vn'
    })
     
    // 替换图片CDN域名
    .match('**.{png,bmp,gif,ico,jpe,jpeg,jpg,wbmp,mp3,swf}', {
        domain: 'http://images-sg-cdn.pocketgamesol.com/cos-vn'
    })
    .match('::package', {
        spriter: fis.plugin('csssprites')
    });

function push(to) {
    return fis.plugin('http-push', {
        receiver: RECEIVER,
        to: to // to = $to + $file.release
    });
}

// 发布更新到线上版本
fis.media('deploy').match('output/**', {
    deploy: push(SERVER_FILE_PATH) // 注意这个是指的是服务器的路径，而非本地机器
});
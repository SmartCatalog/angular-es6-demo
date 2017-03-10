/**
 *
 * @author Jason Johns <jason@academiccatalog.com>
 * Created on 3/10/17.
 */
const   gulp            = require('gulp-help')(require('gulp')),
        autoprefixer    = require('autoprefixer'),
        cleanCss        = require('gulp-clean-css'),
        concatCss       = require('gulp-concat-css'),
        babelify        = require('babelify'),
        browserify      = require('browserify'),
        buffer          = require('vinyl-buffer'),
        debug           = require('gulp-debug'),
        del             = require('del'),
        jscs            = require('gulp-jscs'),
        notify          = require('gulp-notify'),
        ngAnnotate      = require('browserify-ngannotate'),
        plumber         = require('gulp-plumber'),
        postcss         = require('gulp-postcss'),
        postcssUrl      = require('postcss-url'),
        rename          = require('gulp-rename'),
        sass            = require('gulp-sass'),
        source          = require('vinyl-source-stream'),
        sourcemaps      = require('gulp-sourcemaps'),
        templateCache   = require('gulp-angular-templatecache'),
        uglify          = require('gulp-uglify');

const   jsFiles     = './src/js/**/*.js',
        viewFiles   = './src/js/**/*.html',
        fontFiles   = [ './node_modules/bootstrap-sass/assets/fonts/bootstrap/*'],
        mainStyle   = './src/styles/styles.scss',
        styleFiles  = ['./src/styles/**/*.scss', './src/js/**/*.scss'];

const vendors = [
    'angular',
    'angular-sanitize',
    'angular-ui-router',
    'angular-resource',
    'angular-ui-bootstrap',
    'angular-local-storage',
];

let interceptErrors = function(error) {
    "use strict";
    let args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end');
};

gulp.task('build:vendor', 'Build the vendor dependencies into external file', () => {
    "use strict";

    const b = browserify({
        debug: true
    });
    vendors.forEach(lib => {
        b.require(lib);
    });

    b.bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', interceptErrors)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'))
});

gulp.task('build:app', 'Build all app source files', ['views'], () => {
    "use strict";
    return browserify({
        entries: './src/js/app.js',
        debug: true
    })
        .external(vendors)
        .transform(babelify, {presets: ['es2015'], plugins: ['transform-class-properties'], compact: false})
        .transform(ngAnnotate)
        .bundle()
        .on('error', interceptErrors)
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/'));

});

gulp.task('build', 'Build vendor and app dependencies to separate files', ['build:vendor', 'build:app']);

gulp.task('clean', 'Delete the build folder and all contents', () => {
    "use strict";
     del('./build/').then(paths => {
         notify('Paths deleted: ' + paths)
     });
});

gulp.task('css:minify', 'Merge all CSS files to one and minify', ['css:merge'], () => {
    "use strict";
    return gulp.src('./build/bundle.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCss('bundle.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'));
});


gulp.task('css:merge', 'Merge discrete CSS files to one', () => {
    "use strict";

    const processors = [
        postcssUrl({url: (url, decl, from, dirname, to, options, result) => {
            if (url.indexOf('fonts') === -1)
                return `../fonts/${url}`;
        }})
    ];

    return gulp.src(['./build/css/*.css', './build/main.css'])
        .pipe(concatCss('bundle.css'))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./build'));
});

gulp.task('copy:fonts', 'Copy font files from Bootstrap to locally accessible location', () => {
    "use strict";

    gulp.src(fontFiles)
        .pipe(gulp.dest('./build/fonts'))

});

gulp.task('copy', 'Execute all copy tasks', ['copy:fonts', 'copy:css']);

gulp.task('js-lint', 'Lint JS with JSCS', () => {
    "use strict";
    return gulp.src('./src/js/**/*.js')
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('sass', 'Compile SCSS sources to CSS files', () => {
    "use strict";
    return gulp.src(mainStyle)
        .pipe(sass({
            sourceComments: false
        }))
        .on('error', interceptErrors)
        .pipe(sourcemaps.init())
        .pipe(rename('main.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('views', 'Compile all view templates to Angular templatecache', () => {
    "use strict";
    return gulp.src(viewFiles)
        .pipe(templateCache({standalone: true}))
        .on('error', interceptErrors)
        .pipe(rename('app.templates.js'))
        .pipe(gulp.dest('./src/js/config'));
});

gulp.task('default', 'Clean, rebuild and start file watchers', ['clean', 'copy', 'build', 'sass'], () => {
    "use strict";
    gulp.watch(jsFiles, ['build:app']);
    gulp.watch(viewFiles, ['views']);
    gulp.watch(styleFiles, ['sass']);
});

gulp.task('deploy', 'Deploy to a build environment without watch tasks', ['clean', 'copy', 'build', 'sass']);
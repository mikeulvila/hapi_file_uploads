'use strict';

const fs = require('fs');
const path = require('path');

exports.register = function (server, options, next) {

    //Creating routes
    server.route({
        method: 'GET',
        path: '/',
        handler: {
            file: './public/upload.html'
        }
    });

    //Default - parses and loads file into memory
    server.route({
        method: 'POST',
        path: '/upload-data',
        handler: function (request, reply) {

            //The complete uploaded file in memory
            const uploadedFile = request.payload.file;

            //Create the destination path -> we don't get the original filename
            const dest = path.join('./uploads', 'uploadedFile');

            fs.writeFile(dest, uploadedFile, (err) => {

                if (err) {
                    throw err;
                }

                return reply({
                    status: 'ok'
                });
            });
        }
    });

    //Gets you a file stream
    server.route({
        method: 'POST',
        path: '/upload-stream',
        handler: function (request, reply) {

            //Get the stream of the uploaded file
            const uploadedFileStream = request.payload.file;

            //Extract the original file name
            const fileName = path.basename(request.payload.file.hapi.filename);

            //Create the destination path
            const dest = path.join('./uploads', fileName);

            //Write the file to disk
            uploadedFileStream.pipe(fs.createWriteStream(dest));

            return reply({
                status: 'ok'
            });
        },
        config: {
            payload: {
                output: 'stream'
            }
        }
    });

    //Writes file to upload directory
    server.route({
        method: 'POST',
        path: '/upload-file',
        handler: function (request, reply) {

            console.log('Path: ' + request.payload.file.path);

            return reply({
                status: 'ok'
            });
        },
        config: {
            payload: {
                output: 'file',
                uploads: './uploads' //defaults to os tempdir
            }
        }
    });


    return next();
};

exports.register.attributes = {
    name: 'routes-upload'
};

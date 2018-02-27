HDXTOOLS ANGULAR LIBRARY
========================

INFO
----
The build scripts are based on the following repo `Angular QuickStart Lib <https://github.com/filipesilva/angular-quickstart-lib>`_ . Thanks !
The `inline-resources.js <inline-resources.js>`_ script was modified to support **less**.


BUILDING THE LIBRARY
--------------------
To build the library simply run :code:`npm run build`

You can easily package it for testing in a project: :code:`cd dist && npm pack`

USING WITHOUT PUBLISHING
------------------------

Then, to use it in a project: :code:`npm install hdx-ng-library/dist/hdxtools-ng-lib-0.0.1.tgz`

Alternatively, you can put in the `package.json <package.json>`_ something like :code:`"hdxtools-ng-lib": "file:/srv/hxlpreview/hdxtools-ng-library/dist/hdxtools-ng-lib-0.2.2.tgz"` in the *dependencies* section and then just run :code:`npm install`


More information about using a library `without publishing on npm server <http://podefr.tumblr.com/post/30488475488/locally-test-your-npm-modules-without-publishing>`_


**NOTE**: For now the library is not published on npm but is part of this repo in `build <build>`_

  

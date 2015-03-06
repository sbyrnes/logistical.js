# logistical.js [![Code Climate](https://codeclimate.com/github/sbyrnes/logistical.js/badges/gpa.svg)](https://codeclimate.com/github/sbyrnes/logistical.js)

WORK IN PROGRESS
A classification library using logistic regression written in pure Javascript, available for Node.js. 

Description
---------
Logistical.js is a binary classifier for javascript applications. After being training with known examples having a 1 or 0 value, it can predict if new examples would have a 1 or 0 value. Logistical.js uses logistic regression to perform the classification.

An example use of such a classifier is an email spam filter, where the text of incoming emails is classified as either spam or not spam.

Installation
---------

    npm install logistical

Usage
---------

To use Logistical.js, require the logistical.js module and follow the 2 steps below.

  ```javascript
    var Classifier = require('logistical');
  ```

#### STEP 1. Train your classifier.

First, create a new classifier.

  ```javascript
    var classifier = new Classifier();
  ```  

And then provide a series of training examples to build a model. The training examples should be comprised of both an expected value (0 or 1) and a series of descriptive values, represented by a JSON object. You can provide as many examples as necessary.

  ```javascript
    classifier.train(0, {field1: 'hello', field2: 23});
    classifier.train(1, {field1: 'goodbye', field2: 12});
    classifier.train(0, {field1: 'hi', field2: 34});
```  

#### STEP 2. Classify.

To classify, simply provide an input JSON object matching the form of the descriptive values of the training examples. The return value will be the name of the group that best matches the input.

  ```javascript
    var value = classifier.classify({field1: 'bye', field2: 5});

    // value = '1'
  ```  

Working With Files
---------

It will be rare that the training and classification data will be simple strings in memory. To read and classify JSON files, just use the following equivalents to the functions mentioned above:

To train from a file:

  ```javascript
  classifier.trainFromFile(1, filename);
  ```
To classify a file:

  ```javascript
  var value = classifier.classifyFile(filename);
  ```

You can train the same classifier using both files and objects, as well as classify both files and objects using a classifier.

# Alma-UnsortAnalytics
Add a calculated position column in Analytics report sorting the results based on IN filter elements order.
## Installation
Drag and drop the bookmarklet in your browser bookmark toolbar (or other bookmark menu if you prefer).

[Alma unsort Analytics](https://bediniupi.github.io)

## Use
In a  Analytics reports whit a IN filter with many elements go to Advanced Tab and click on the bookmarklet saved.

## What and how it does
The bookmarklet gets the xml content in the Analysis XML textarea, extract the elements of the first IN filter and add a "Calculated position" based on LOCATE("column", 'elements_string') values and sorts the report by the new colunn: for more info have a look at the JS source code of the bookmarklet.



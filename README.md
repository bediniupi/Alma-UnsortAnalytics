# Alma-UnsortAnalytics
Add a calculated position column in Analytics report sorting the results based on IN filter elements order.
## Installation
Drag and drop the bookmarklet in your browser bookmark toolbar (or other bookmark menu if you prefer).

[Alma unsort Analytics](https://bediniupi.github.io)

## Use
In a  Analytics reports whit a IN filter with many elements go to Advanced Tab and click on the bookmarklet saved.

## What and how it does
The bookmarklet gets the xml content in the Analysis XML textarea, extract the elements of the first IN filter and add a "Calculated position" based on LOCATE("column", 'elements_string') values and sorts the report by the new column.

In Analytics even if a sorting is not applied the results are sorted by the first column, but in some case you may have a sequence of data in a IN filter, like this:

"Caption"."Column" IN "elem32;elem12;elem13;elem76;elem22;elem02"
and you do not want a result reordered like this:

elem02

elem12

elem13

elem22

elem32

elem76


We need to assign a sorting numeric value that depends on the position of the not ordere elements in the IN filter: to obtain this we can use the LOCATE string function like this:

LOCATE("Caption"."Column", 'elem32;elem12;elem13;elem76;elem22;elem02') 

In a new column with this formula, we have this result:

elem02  34
elem12   6
elem13  13
elem22  26
elem32   0
elem76  21

So if we add an ascendig sorting to the new column we obtain the result as ordered as IN filter elements:
elem32   0
elem12   6
elem13  13
elem76  21
elem22  26
elem02  34

Instead to add the new column manually (possible if there are few data) here you a bookmarklet code that modify the analysis in a click.

For more detailed info have a look at the JS source code of the bookmarklet.

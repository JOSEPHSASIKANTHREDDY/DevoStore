using app.demoDetails as entityName from '../db/demoDetails';
service CatalogService {

// @requires: 'Admin'
// @restrict: [{ grant: 'READ'}]
 entity Application_Area
    as projection on entityName.Application_Area;

 entity Sub_Area
    as projection on entityName.Sub_Area;

 entity Demo_Details
    as projection on entityName.Demo_Details;    

 entity Images 
   as projection on entityName.Images;
}
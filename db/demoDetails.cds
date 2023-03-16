namespace app.demoDetails;

using { Country } from '@sap/cds/common';
type BusinessKey : String(10);
type SDate : DateTime;
type LText : String(1024);
type XLText : String(5000);
type SText : String(100);


entity Application_Area {
  key applicationAreaId : String(20);
      applicationAreaName : SText;
};
entity Sub_Area {
  key subAreaId : String(20);
      applicationAreaId : String(20);
      subAreaName : SText;
};
entity Demo_Details {
    key demoId : String(20);
        applicationAreaName : SText;
        subAreaName : SText;
        industry : SText;
        applicationName : SText;
        description : LText;
        videoLink : LText;
        diagramLink : Composition of many Images on diagramLink.parent = $self;
        demoCreationDate : SDate;
        demoCreatedBy : SText;
        pointOfContact : LText;
};

entity Images {
    key parent: Association to Demo_Details;
    key ID : UUID;
        image : LargeBinary @Core.MediaType: 'image/png' @Core.ContentDisposition.Filename: fileName @Core.ContentDisposition.Type: 'inline';
        imageURL: String(255);
        fileName : String;
    
}

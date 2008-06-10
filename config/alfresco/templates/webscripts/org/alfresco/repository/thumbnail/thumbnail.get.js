function main()
{
   // Get the node from the URL
   var pathSegments = url.match.split("/");
   var reference = [ url.templateArgs.store_type, url.templateArgs.store_id ].concat(url.templateArgs.id.split("/"));
   var node = search.findNode(pathSegments[2], reference);
 
   // 404 if the node to thumbnail is not found
   if (node == null)
   {
      status.setCode(status.STATUS_NOT_FOUND, "The thumbnail source node could not be found");
	  return;
   }
   
   // Get the thumbnail name from the JSON content 
   var thumbnailName = url.templateArgs.thumbnailname; //pathSegments[pathSegments.length - 1];
   
   // 404 if no thumbnail name found
   if (thumbnailName == null)
   {
      status.setCode(status.STATUS_NOT_FOUND, "Thumbnail name was not provided");
      return;
   }  
   
   // Get the queue create flag
   var qc = false;
   var qcString = args.qc;
   if (qcString != null)
   {
      qc = utils.toBoolean(qcString);
   }
   
   // Get the place holder flag
   var ph = false;
   var phString = args.ph;
   if (phString != null)
   {
      ph = utils.toBoolean(phString);
   }
   
   // Get the thumbnail
   var thumbnail = node.getThumbnail(thumbnailName);
   if (thumbnail == null)
   {
      // Queue the creation of the thumbnail if appropriate
      if (qc == true)
      {
         node.createThumbnail(thumbnailName, true);
      }		
      
      if (ph == true)
      {
         // Try and get the place holder resource
         var phPath = thumbnailService.getPlaceHolderResourcePath(thumbnailName);
         if (phPath == null)
         {
            // 404 since no thumbnail was found
            status.setCode(status.STATUS_NOT_FOUND, "Thumbnail was not found and no place holde resource set for '" + thumbnailName + "'");
            return;
         }
         else
         {
            // Set the resouce path in the model ready for the content stream to send back to the client
            model.contentPath = phPath;
         }
      }
      else
      {         
         // 404 since no thumbnail was found
         status.setCode(status.STATUS_NOT_FOUND, "Thumbnail was not found");
         return;
      }
   }
   else
   {
   	  // Place the details of the thumbnail into the model, this will be used to stream the content to the client
      model.contentNode = thumbnail;
   } 
}

main();
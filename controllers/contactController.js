const asyncHandler=require("express-async-handler");
const Contact=require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts=asyncHandler(async(req,res)=>{
    const contacts=await Contact.find({user_id : req.user.id});
    res.status(200).json({
        success:true,
        message:"Contacts fetched successfully",
        contacts
    });
});

//@desc Create New contacts
//@route POST /api/contacts
//@access private
const createContact=asyncHandler(async(req,res)=>{
    console.log("The request body is:",req.body);
    const {name,email,phone}=req.body;
    if(!name || !email || !phone)
    {
        res.status(400);
        throw new Error("All feilds are mandotory!");
    }
    const contact= await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id,
    }); 
    res.status(201).json({
        success:true,
        message:"Contact created successfully",
        contact
    });
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private
const getContact=asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    res.status(200).json({
        success:true,
        message:"Contact fetched successfully",
        contact
    });
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact=asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }

    if(contact.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
        );
    res.status(200).json({
        success:true,
        message:"Contact updated successfully",
        updatedContact
    });
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact=asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }

    if(contact.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("User don't have permission to Delete other user contacts");
    }

    //await Contact.remove({_id : req.params.id});
    await Contact.deleteOne({_id : req.params.id});
    res.status(200).json({
        success:true,
        message:"Contact deleted successfully",
        contact
    });
});

module.exports={getContacts,createContact,getContact,updateContact,deleteContact};
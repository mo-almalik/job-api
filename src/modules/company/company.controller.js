import fs from "fs"
import { catchError, AppError } from "../../../utils/error.js"
import {Company} from "../../models/company.js";


// create new company
export const createNewCompany = catchError(async (req, res) => {

try{
    req.body.employeesId = req.user.id;

    if (!req.files.logo){
        return res.status(400).json({
            message :'شعار الشركة مطلوب'
        })
    }
    if (req.files) {
        if (req.files.logo ) {
            req.body.logo = req.files.logo[0].path ;
        }
        if (req.files.cover) {
            req.body.cover = req.files.cover[0].path ;
        }
    }

    await Company.create(req.body);
    res.status(201).json({
        message: 'تم انشاء ملف الشركة بنجاح',
    });

}catch (e) {
    if (req.files) {
        if (req.files.logo && req.files.logo.length > 0) {
            fs.unlinkSync(req.files.logo[0].path);
        }
        if (req.files.cover && req.files.cover.length > 0) {
            fs.unlinkSync(req.files.cover[0].path);
        }
    }
throw  new AppError('حدث خطأ أثناء إنشاء ملف الشركة' , 500 )

}
});

// create update company
export const updateCompany = catchError(async (req, res) => {
    const { id } = req.params;
    const employeesId = req.user.id;

    const chickIsExist = await Company.findById(id);
    if (!chickIsExist || employeesId !== chickIsExist.employeesId.toString()) {
        return res.status(400).json({
            message: "لم يتم العثور على الشركة أو أنك لا تملك صلاحية التعديل",
        });
    }
    if (req.files) {
        if (req.files.logo) {
            req.body.logo = handleFileUpdate(chickIsExist.logo, req.files.logo[0]);
        }
        if (req.files.cover) {
            req.body.cover = handleFileUpdate(chickIsExist.cover, req.files.cover[0]);
        }
    }

    const update = await Company.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({
        message: "تم تحديث ملف الشركة بنجاح",
        data: update,
    });
});

// delete company
export const deleteCompany = catchError(async (req,res)=>{
    const employeesId = req.user.id
    const id = req.params.id
    const company = await Company.findById(id)

    if(!company || employeesId !== company.employeesId.toString()){
        return res.status(400).json({
            message: 'الشركة غير موجودة أو ليس لديك الصلاحية لحذفها',
        })
    }

    if (company && employeesId === company.employeesId.toString()){
        if (company.logo ){
            fs.unlinkSync(company.logo)
        }if (company.cover ){
            fs.unlinkSync(company.cover)
        }
        await Company.findByIdAndDelete(id)
        return res.status(200).json({
            message: ` تم حذف الشركة: ${company.name}`,
        })
    }

})


// get all company
export const getAllCompany= catchError(async (req,res)=>{
    const company = await Company.find().select('-employeesId')
    res.status(200).json({
        data: company,
    })
})

// get company by id
export const getCompanyById= catchError(async (req,res)=>{
    const company = await Company.findById(req.params.id).select( '-employeesId')
    if (!company){
        return res.status(404).json({
            message:"لم يتم العثور علي الشركة"
        })
    }
    res.status(200).json({
        data: company,
    })
})

// get my company
export const getNyCompany= catchError(async (req,res)=>{
    const company = await Company.find({ employeesId: req.user.id });
    if (!company){
        return res.status(404).json({
            message:"لم يتم العثور علي الشركة"
        })
    }
    res.status(200).json({
        data: company,
    })
})



const handleFileUpdate = (currentPath, file) => {
    try {

        if (currentPath && fs.existsSync(currentPath)) {
            fs.unlinkSync(currentPath);
        }
        return file?.path || null;
    } catch (err) {
        throw new Error("خطأ أثناء تحديث الملف.");
    }
};
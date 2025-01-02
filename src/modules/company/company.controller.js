import fs from "fs"
import { catchError, AppError } from "../../../utils/error.js"
import {Company} from "../../models/company.js";


// create new company
export const createNewCompany = catchError(async (req, res) => {

try{
    req.body.employeesId = req.user.id;
    // const checkIfAddCompany = await Company.findOne({ employeesId:req.body.employeesId})
    // if (checkIfAddCompany) {
    //     return res.status(403).json({
    //         message :'تم اضافة شركة من قبل '
    //     })
    //
    // }

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
    console.log(req.files)
    await Company.create(req.body);
    res.status(201).json({
        message: 'تم انشاء ملف الشركة بنجاح',
    });

}catch (e) {
    console.log(e)
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



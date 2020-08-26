router.post('/regist',upload.single('crePic'), asyncHandler(async function (req, res, next) {
    try {
        var user = await User.createUser({
            email: req.body.email,
            password: req.body.password,
            fullName: req.body.fullName,
            creID: req.body.creID,
            creType: req.body.creType,
            creGrantDate: req.body.creGrantDate,
            crePic: req.file.path
        });
        console.log('post regist ... ');
        console.log(user);

        // uploadFile(req, res, (error) => {
        //     // Nếu có lỗi thì trả về lỗi cho client.
        //     // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
        //     if (error) {
        //         return res.send(`Error when trying to upload: ${error}`);
        //     }
        //     // Không có lỗi thì lại render cái file ảnh về cho client.
        //     // Đồng thời file đã được lưu vào thư mục uploads
        // });
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        res.render(`${regist}regist`);
    }
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
}));

module.exports = router;
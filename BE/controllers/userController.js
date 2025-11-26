const User = require('../models/User')

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password') // Không trả về password
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' })
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' })
    }
}

const sanitizePayload = (payload = {}) => {
    const cleaned = { ...payload }
    Object.keys(cleaned).forEach((key) => {
        if (cleaned[key] === undefined) {
            delete cleaned[key]
        }
    })
    return cleaned
}

const updateCurrentUser = async (req, res) => {
    const { username, email, fullName, birthday, phone } = req.body
    console.log('⚙️ Dữ liệu update:', { id: req.user.id, username, email, fullName, birthday, phone })

    try {
        const updateData = sanitizePayload({ username, email, fullName, birthday, phone })
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password')
        if (!updatedUser) {
            return res.status(404).json({ message: 'Không tìm thấy user để cập nhật' })
        }
        res.json(updatedUser)
    } catch (err) {
        console.error('❌ Lỗi server khi cập nhật:', err)
        res.status(500).json({ message: 'Cập nhật thất bại', error: err.message })
    }
}

const getAll = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' })
    }
}

const updateUser = async (req, res) => {
    const { username, email, role, fullName, birthday, phone } = req.body
    try {
        const updateData = sanitizePayload({ username, email, role, fullName, birthday, phone })
        if (updateData.birthday === "") {
            delete updateData.birthday
        } else if (updateData.birthday) {
            updateData.birthday = new Date(updateData.birthday)
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password')
        res.json(user)
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật người dùng' })
    }
}

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ message: 'User deleted' })
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa người dùng' })
    }
}

module.exports = { getUser, updateCurrentUser, updateUser, getAll, deleteUser }
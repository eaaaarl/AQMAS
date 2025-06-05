Public Class LoginForm
    Private Sub LoginForm_Load(sender As Object, e As EventArgs) Handles MyBase.Load

    End Sub

    Private Sub btnLogin_Click(sender As Object, e As EventArgs) Handles btnLogin.Click
        If String.IsNullOrWhiteSpace(txtUsername.Text) OrElse String.IsNullOrWhiteSpace(txtPassword.Text) Then
            MessageBox.Show("Please enter both username and password", "Login Error",
                            MessageBoxButtons.OK, MessageBoxIcon.Warning)
            Return
        End If

        ' TODO: Add your authentication logic here
        ' Example: Check against database
        If AuthenticateUser(txtUsername.Text, txtPassword.Text) Then
            Dim mainForm As New MainForm()
            mainForm.Show()
            Me.Hide()
        Else
            MessageBox.Show("Invalid username or password", "Login Failed",
                            MessageBoxButtons.OK, MessageBoxIcon.Error)
            txtPassword.Clear()
            txtUsername.Focus()
        End If
    End Sub

    Private Sub chkShowPassword_CheckedChanged(sender As Object, e As EventArgs) Handles chkShowPassword.CheckedChanged
        txtPassword.UseSystemPasswordChar = Not chkShowPassword.Checked
    End Sub

    Private Sub txtPassword_KeyDown(sender As Object, e As KeyEventArgs) Handles txtPassword.KeyDown
        If e.KeyCode = Keys.Enter Then
            btnLogin.PerformClick()
        End If
    End Sub

    Private Function AuthenticateUser(username As String, password As String) As Boolean
        ' Replace this with actual authentication logic
        ' Example: Database check
        Return (username = "admin" AndAlso password = "admin123")
    End Function
End Class
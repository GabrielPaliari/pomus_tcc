from django.db import models

MAX_FILE_SIZE = 100000

class Document(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    upload = models.FileField()

    def save(self, *args, **kwargs):
        ''' On save, validate file size timestamps '''
        if not self.id:        
            size = len(self.upload)
            if size < MAX_FILE_SIZE:
                return super(Document, self).save(*args, **kwargs)

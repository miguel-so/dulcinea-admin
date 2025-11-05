import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import DulcineaInput from '../components/common/DulcineaInput';
import DulcineaTextarea from '../components/common/DulcineaTextarea';
import urlConstants from '../lib/constants/url.constants';
import useToastNotification from '../lib/hooks/useToastNotification';
import useApi from '../lib/hooks/useApi';
import { ApiCommand } from '../lib/Api';
import { useParams } from 'react-router-dom';

const { contact: contactUrl } = urlConstants;

const ContactForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const { artworkId } = useParams();

  const showToast = useToastNotification();
  const { loading: isContactRequestLoading, sendRequest: contactRequest } =
    useApi();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    contactRequest({
      callback(data: any, error) {
        if (error) {
          showToast({
            title: 'Failed',
            description: error,
            status: 'error',
          });
          return;
        }
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        showToast({
          title: 'Success',
          description: data?.message,
          status: 'success',
        });
      },
      command: ApiCommand.POST,
      url: contactUrl,
      options: {
        artworkId,
        name,
        email,
        phone,
        message,
      },
    });
  };

  return (
    <Box
      bg='gray.50'
      minH='calc(100vh - 72px)'
      display='flex'
      alignItems='center'
      justifyContent='center'
      py={0}
    >
      <Container
        maxW='container.md'
        bg='white'
        p={8}
        borderRadius='md'
        boxShadow='md'
      >
        <Heading as='h2' size='xl' mb={8} textAlign='center' color='#1f6463'>
          Send Your Message
        </Heading>
        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
            <FormControl id='name' isRequired>
              <FormLabel>Name</FormLabel>
              <DulcineaInput
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id='email' isRequired>
              <FormLabel>Email</FormLabel>
              <DulcineaInput
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id='phone'>
              <FormLabel>Phone</FormLabel>
              <DulcineaInput
                type='tel'
                placeholder='Phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
          <FormControl id='message' mb={4} isRequired>
            <FormLabel>Your Message</FormLabel>
            <DulcineaTextarea
              placeholder='Your Message'
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </FormControl>
          <Box textAlign='center'>
            <Button
              backgroundColor='#1f6463'
              colorScheme='green'
              _hover={{ backgroundColor: '#1f6463', opacity: 0.9 }}
              type='submit'
              isLoading={isContactRequestLoading}
              disabled={!name || !email || !message}
            >
              Send Now
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default ContactForm;
